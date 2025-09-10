import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders } from '../_shared/cors.ts'
import { 
  validateInvitationCode, 
  checkRateLimit, 
  logSecurityEvent, 
  getSecurityHeaders
} from '../_shared/security.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  const isDevelopment = Deno.env.get('RUNTIME_ENV') === 'development';
  const securityHeaders = getSecurityHeaders(isDevelopment);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { ...corsHeaders, ...securityHeaders } });
  }

  try {

    const { code } = await req.json();
    console.log('[VALIDATE-INVITATION] Validating code:', code);

    // Enhanced input validation
    if (!code || typeof code !== 'string') {
      console.log('[VALIDATE-INVITATION] Invalid input - missing or invalid code');
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid invitation code format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Sanitize and validate code format
    const sanitizedCode = code.trim().toUpperCase();
    if (!validateInvitationCode(sanitizedCode)) {
      console.log('[VALIDATE-INVITATION] Invalid code format:', sanitizedCode);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Invalid invitation code format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, ...securityHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Rate limiting check - basic implementation
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     'unknown';

    // Check rate limit
    const { data: rateLimitData } = await supabase
      .from('security_rate_limits_enhanced')
      .select('*')
      .eq('identifier', clientIP)
      .eq('action_type', 'invitation_validation')
      .gte('window_start', new Date(Date.now() - 15 * 60 * 1000).toISOString())
      .single();

    if (rateLimitData && rateLimitData.attempts >= 10) {
      console.log('[VALIDATE-INVITATION] Rate limit exceeded for IP:', clientIP);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Too many attempts. Please try again later.' 
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Update rate limit counter
    if (rateLimitData) {
      await supabase
        .from('security_rate_limits_enhanced')
        .update({ 
          attempts: rateLimitData.attempts + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', rateLimitData.id);
    } else {
      await supabase
        .from('security_rate_limits_enhanced')
        .insert({
          identifier: clientIP,
          action_type: 'invitation_validation',
          attempts: 1
        });
    }

    // Use the secure validation function
    const { data: validationResult, error: validationError } = await supabase
      .rpc('validate_invitation_code_secure', { invitation_code: sanitizedCode });

    if (validationError) {
      console.error('[VALIDATE-INVITATION] Database error:', validationError);
      return new Response(
        JSON.stringify({ 
          valid: false, 
          error: 'Validation service unavailable' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('[VALIDATE-INVITATION] Validation result:', validationResult);

    // Log security event
    await supabase
      .from('enhanced_security_logs')
      .insert({
        action: 'invitation_validation',
        resource: 'patient_invitations',
        success: validationResult?.valid || false,
        details: {
          code: sanitizedCode,
          ip_address: clientIP,
          result: validationResult
        },
        ip_address: clientIP
      });

    return new Response(
      JSON.stringify(validationResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('[VALIDATE-INVITATION] Unexpected error:', error);
    
    // Log security event for error
    await supabase
      .from('enhanced_security_logs')
      .insert({
        action: 'invitation_validation_error',
        resource: 'patient_invitations',
        success: false,
        details: {
          error: error.message,
          ip_address: req.headers.get('cf-connecting-ip') || 'unknown'
        }
      });

    return new Response(
      JSON.stringify({ 
        valid: false, 
        error: 'Service temporarily unavailable' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});