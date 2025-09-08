import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  first_name: string;
  last_name: string;
  phone: string;
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

    // Get the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header missing' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user from auth header
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authorization' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is a psychologist/clinician
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', user.id)
      .single();

    if (!profile || (profile.role !== 'clinician' && profile.role !== 'psychologist')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Only clinicians can create invitations' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { first_name, last_name, phone }: InvitationRequest = await req.json();

    // Validate required fields
    if (!first_name?.trim() || !last_name?.trim() || !phone?.trim()) {
      return new Response(
        JSON.stringify({ error: 'First name, last name, and phone are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Normalize phone to E.164 format
    const { data: normalizedPhone, error: phoneError } = await supabase
      .rpc('normalize_phone_e164', { phone_input: phone });

    if (phoneError) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if patient already exists for this psychologist
    const { data: existingPatient } = await supabase
      .from('invited_patients')
      .select('id, status')
      .eq('psychologist_id', user.id)
      .eq('phone_e164', normalizedPhone)
      .single();

    let patientId: string;

    if (existingPatient) {
      if (existingPatient.status === 'registered') {
        return new Response(
          JSON.stringify({ error: 'Patient with this phone number is already registered' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      // Update existing invited patient
      const { data: updatedPatient, error: updateError } = await supabase
        .from('invited_patients')
        .update({
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPatient.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating patient:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update patient information' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      patientId = updatedPatient.id;
    } else {
      // Create new invited patient
      const { data: newPatient, error: patientError } = await supabase
        .from('invited_patients')
        .insert({
          psychologist_id: user.id,
          first_name: first_name.trim(),
          last_name: last_name.trim(),
          phone_e164: normalizedPhone,
          status: 'invited'
        })
        .select('id')
        .single();

      if (patientError) {
        console.error('Error creating patient:', patientError);
        return new Response(
          JSON.stringify({ error: 'Failed to create patient invitation' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      patientId = newPatient.id;
    }

    // Generate invitation code
    const { data: inviteCode, error: codeError } = await supabase
      .rpc('generate_invitation_code');

    if (codeError) {
      console.error('Error generating code:', codeError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate invitation code' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create invitation with 72 hour expiration
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    const { data: invitation, error: inviteError } = await supabase
      .from('patient_invitations')
      .insert({
        patient_id: patientId,
        psychologist_id: user.id,
        code: inviteCode,
        expires_at: expiresAt.toISOString()
      })
      .select('code')
      .single();

    if (inviteError) {
      console.error('Error creating invitation:', inviteError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build URLs
    const baseUrl = Deno.env.get('SITE_URL') || 'https://d5f6f819-d32f-4a69-9d15-a0ee7a0c0771.lovableproject.com';
    const inviteUrl = `${baseUrl}/invite/${invitation.code}`;
    
    // Generate WhatsApp message
    const psychologistName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'tu psicólogo/a';
    const message = `Hola ${first_name.trim()} 👋, ${psychologistName} te invita a registrarte en MoodMate. Usá este enlace para crear tu cuenta y quedar vinculado/a: ${inviteUrl}`;
    
    // Generate WhatsApp deeplink
    const phoneForWhatsApp = normalizedPhone.replace('+', '');
    const whatsappUrl = `https://wa.me/${phoneForWhatsApp}?text=${encodeURIComponent(message)}`;

    return new Response(
      JSON.stringify({
        patient_id: patientId,
        invite_code: invitation.code,
        invite_url: inviteUrl,
        whatsapp_deeplink: whatsappUrl
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