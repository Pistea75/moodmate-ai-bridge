import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const url = new URL(req.url);
    const code = url.pathname.split('/').pop();

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Invitation code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('patient_invitations')
      .select(`
        code,
        expires_at,
        used_at,
        invited_patients (
          first_name,
          last_name,
          status
        ),
        profiles (
          first_name,
          last_name
        )
      `)
      .eq('code', code)
      .single();

    if (inviteError || !invitation) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid invitation code' 
        }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invitation code has expired' 
        }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is already used
    if (invitation.used_at) {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invitation code has already been used' 
        }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if patient is already registered
    if (invitation.invited_patients?.status === 'registered') {
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Patient is already registered' 
        }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const psychologistName = invitation.profiles 
      ? `${invitation.profiles.first_name || ''} ${invitation.profiles.last_name || ''}`.trim()
      : 'tu psicólogo/a';

    return new Response(
      JSON.stringify({
        valid: true,
        patient_preview: {
          first_name: invitation.invited_patients?.first_name || '',
          last_name: invitation.invited_patients?.last_name || ''
        },
        psychologist_name: psychologistName
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});