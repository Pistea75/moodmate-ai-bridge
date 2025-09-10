import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from '../_shared/cors.ts';
import { 
  validateEmail,
  validatePhone,
  validateName,
  checkRateLimit,
  logSecurityEvent,
  getSecurityHeaders,
  validatePayload,
  sanitizeHtml
} from '../_shared/security.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface InvitationRequest {
  first_name: string;
  last_name: string;
  phone: string;
  email?: string;
}

Deno.serve(async (req) => {
  const isDevelopment = Deno.env.get('RUNTIME_ENV') === 'development';
  const securityHeaders = getSecurityHeaders(isDevelopment);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: { ...corsHeaders, ...securityHeaders } 
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  const clientIP = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  try {
    // Rate limiting check
    const rateLimit = await checkRateLimit(supabase, clientIP, 'create_invitation', 30, 60);
    if (!rateLimit.allowed) {
      await logSecurityEvent(
        supabase,
        'invitation_create_rate_limited',
        { ip: clientIP },
        'warning',
        undefined,
        clientIP,
        userAgent
      );

      return new Response(
        JSON.stringify({ 
          error: 'Rate limit exceeded. Try again later.',
          retryAfter: 60 
        }),
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            ...securityHeaders,
            'Retry-After': '60',
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization required' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['clinician', 'psychologist'].includes(profile.role)) {
      await logSecurityEvent(
        supabase,
        'invitation_create_unauthorized',
        { userId: user.id, role: profile?.role },
        'warning',
        user.id,
        clientIP,
        userAgent
      );

      return new Response(
        JSON.stringify({ error: 'Unauthorized. Only clinicians can create invitations.' }),
        { 
          status: 403, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validation = validatePayload(body, ['first_name', 'last_name', 'phone']);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: 'Invalid request', details: validation.errors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { first_name, last_name, phone, email }: InvitationRequest = body;

    // Validate individual fields
    if (!validateName(first_name)) {
      return new Response(
        JSON.stringify({ error: 'Invalid first name format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!validateName(last_name)) {
      return new Response(
        JSON.stringify({ error: 'Invalid last name format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!validatePhone(phone)) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone format. Use E.164 format (+country code)' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (email && !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Sanitize inputs
    const sanitizedFirstName = sanitizeHtml(first_name.trim());
    const sanitizedLastName = sanitizeHtml(last_name.trim());
    const sanitizedEmail = email ? sanitizeHtml(email.trim()) : null;

    // Normalize phone number using existing RPC
    const { data: normalizedPhone, error: phoneError } = await supabase
      .rpc('normalize_phone_e164', { phone_input: phone });

    if (phoneError || !normalizedPhone) {
      return new Response(
        JSON.stringify({ error: 'Failed to normalize phone number' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Check for existing patient with same phone
    const { data: existingPatient } = await supabase
      .from('invited_patients')
      .select('id, status, user_id')
      .eq('phone_e164', normalizedPhone)
      .eq('psychologist_id', user.id)
      .single();

    let patientId: string;

    if (existingPatient) {
      // Update existing patient
      const { data: updatedPatient, error: updateError } = await supabase
        .from('invited_patients')
        .update({
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
          email: sanitizedEmail,
          status: 'invited',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingPatient.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating patient:', updateError);
        return new Response(
          JSON.stringify({ error: 'Failed to update patient information' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      patientId = updatedPatient.id;
    } else {
      // Create new patient
      const { data: newPatient, error: createError } = await supabase
        .from('invited_patients')
        .insert({
          first_name: sanitizedFirstName,
          last_name: sanitizedLastName,
          phone_e164: normalizedPhone,
          email: sanitizedEmail,
          psychologist_id: user.id,
          status: 'invited'
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating patient:', createError);
        return new Response(
          JSON.stringify({ error: 'Failed to create patient invitation' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

      patientId = newPatient.id;
    }

    // Generate invitation code
    const { data: invitationCode, error: codeError } = await supabase
      .rpc('generate_invitation_code');

    if (codeError || !invitationCode) {
      console.error('Error generating invitation code:', codeError);
      return new Response(
        JSON.stringify({ error: 'Failed to generate invitation code' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create patient invitation
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000); // 72 hours
    const { data: invitation, error: invitationError } = await supabase
      .from('patient_invitations')
      .insert({
        patient_id: patientId,
        psychologist_id: user.id,
        code: invitationCode,
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (invitationError) {
      console.error('Error creating invitation:', invitationError);
      return new Response(
        JSON.stringify({ error: 'Failed to create invitation' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create invitation URL
    const baseUrl = supabaseUrl.replace('.supabase.co', '.vercel.app'); // Adjust as needed
    const invitationUrl = `${baseUrl}/register?invitation=${invitationCode}`;

    // Create WhatsApp deep link
    const cleanPhone = normalizedPhone.replace('+', '');
    const message = `Hola ${sanitizedFirstName} 👋, te invitamos a registrarte en MoodMate. Usá este enlace para quedar vinculado/a: ${invitationUrl}`;
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

    // Log successful invitation creation
    await logSecurityEvent(
      supabase,
      'invitation_created',
      { 
        patientId, 
        invitationCode: invitationCode.substring(0, 2) + '****', // Partial code for logging
        phoneHash: phone.substring(0, 3) + '****' // Partial phone for logging
      },
      'info',
      user.id,
      clientIP,
      userAgent
    );

    return new Response(
      JSON.stringify({
        success: true,
        patient_id: patientId,
        invitation_code: invitationCode,
        invitation_url: invitationUrl,
        whatsapp_url: whatsappUrl,
        expires_at: expiresAt.toISOString()
      }),
      {
        status: 200,
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in create-patient-invitation-secure:', error);

    await logSecurityEvent(
      supabase,
      'invitation_create_error',
      { error: error.message },
      'critical',
      undefined,
      clientIP,
      userAgent
    );

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: isDevelopment ? error.message : 'Something went wrong'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});