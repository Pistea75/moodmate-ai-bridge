import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AcceptInvitationRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const url = new URL(req.url);
    const code = url.pathname.split('/').pop();

    if (!code) {
      return new Response(
        JSON.stringify({ error: 'Invitation code is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { email, password }: AcceptInvitationRequest = await req.json();

    // Validate input
    if (!email?.trim() || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (password.length < 8) {
      return new Response(
        JSON.stringify({ error: 'Password must be at least 8 characters long' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get invitation details
    const { data: invitation, error: inviteError } = await supabase
      .from('patient_invitations')
      .select(`
        id,
        patient_id,
        psychologist_id,
        expires_at,
        used_at,
        invited_patients (
          id,
          first_name,
          last_name,
          phone_e164,
          status
        )
      `)
      .eq('code', code)
      .single();

    if (inviteError || !invitation) {
      return new Response(
        JSON.stringify({ error: 'Invalid invitation code' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is expired
    const now = new Date();
    const expiresAt = new Date(invitation.expires_at);
    
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: 'Invitation code has expired' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if invitation is already used
    if (invitation.used_at) {
      return new Response(
        JSON.stringify({ error: 'Invitation code has already been used' }),
        { status: 410, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if patient is already registered
    if (invitation.invited_patients?.status === 'registered') {
      return new Response(
        JSON.stringify({ error: 'Patient is already registered' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create user account
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password,
      user_metadata: {
        first_name: invitation.invited_patients?.first_name || '',
        last_name: invitation.invited_patients?.last_name || '',
        role: 'patient',
        referral_code: null
      },
      email_confirm: true
    });

    if (authError) {
      console.error('Error creating user:', authError);
      if (authError.message.includes('already registered')) {
        return new Response(
          JSON.stringify({ error: 'An account with this email already exists' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: 'Failed to create user account' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update invited patient record
    const { error: updatePatientError } = await supabase
      .from('invited_patients')
      .update({
        email: email.trim(),
        status: 'registered',
        user_id: authData.user.id,
        updated_at: new Date().toISOString()
      })
      .eq('id', invitation.patient_id);

    if (updatePatientError) {
      console.error('Error updating patient:', updatePatientError);
      // Note: We don't return here as the user is already created
    }

    // Mark invitation as used
    const { error: markUsedError } = await supabase
      .from('patient_invitations')
      .update({
        used_at: new Date().toISOString()
      })
      .eq('id', invitation.id);

    if (markUsedError) {
      console.error('Error marking invitation as used:', markUsedError);
      // Note: We don't return here as the user is already created
    }

    // Create patient-clinician link
    const { error: linkError } = await supabase
      .from('patient_clinician_links')
      .insert({
        patient_id: authData.user.id,
        clinician_id: invitation.psychologist_id
      });

    if (linkError) {
      console.error('Error creating patient-clinician link:', linkError);
      // Note: We don't return here as the user is already created
    }

    // Generate session for the new user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email.trim()
    });

    return new Response(
      JSON.stringify({
        ok: true,
        patient_id: authData.user.id,
        psychologist_id: invitation.psychologist_id,
        message: 'Account created and linked successfully'
      }),
      { 
        status: 201, 
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