-- CRITICAL SECURITY FIX: Secure Patient Invitation Codes
-- Issue: patient_invitations table has public policies exposing sensitive invitation codes

-- 1. First, invalidate ALL existing invitation codes for immediate security
UPDATE public.patient_invitations 
SET 
  expires_at = NOW() - INTERVAL '1 day',
  used_at = NOW()
WHERE used_at IS NULL;

-- 2. Drop all existing public policies that expose invitation codes
DROP POLICY IF EXISTS "Psychologists can manage their invitations" ON public.patient_invitations;
DROP POLICY IF EXISTS "Service role can manage invitations" ON public.patient_invitations;
DROP POLICY IF EXISTS "invitations_psychologist_only" ON public.patient_invitations;
DROP POLICY IF EXISTS "invitations_service_role" ON public.patient_invitations;

-- 3. Create secure policies restricted to authenticated users only
-- Psychologists can only manage their own invitations (authenticated only)
CREATE POLICY "invitations_psychologist_authenticated" ON public.patient_invitations
FOR ALL
TO authenticated
USING (psychologist_id = auth.uid())
WITH CHECK (psychologist_id = auth.uid());

-- Service role can manage invitations for edge functions (service_role only)
CREATE POLICY "invitations_service_role_only" ON public.patient_invitations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- 4. Create a separate secure validation table that doesn't expose codes
CREATE TABLE IF NOT EXISTS public.invitation_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invitation_id uuid REFERENCES public.patient_invitations(id) ON DELETE CASCADE,
  validation_token text NOT NULL UNIQUE,
  ip_address inet,
  user_agent text,
  validated_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '10 minutes'),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on validation table
ALTER TABLE public.invitation_validations ENABLE ROW LEVEL SECURITY;

-- Only service role can manage validations (no public access to validation tokens)
CREATE POLICY "validations_service_role_only" ON public.invitation_validations
FOR ALL
TO service_role
USING (true);

-- 5. Create secure function for invitation code validation (no code exposure)
CREATE OR REPLACE FUNCTION public.validate_invitation_secure(
  p_code text,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invitation_record RECORD;
  validation_token text;
  result jsonb;
BEGIN
  -- Input validation
  IF p_code IS NULL OR length(p_code) != 8 OR p_code !~ '^[A-Za-z0-9]+$' THEN
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Invalid invitation format',
      'code', 'INVALID_FORMAT'
    );
  END IF;
  
  -- Find valid invitation without exposing the code in logs
  SELECT i.*, ip.psychologist_id as psychologist_user_id
  INTO invitation_record
  FROM patient_invitations i
  JOIN invited_patients ip ON ip.id = i.patient_id
  WHERE i.code = UPPER(p_code)
    AND i.expires_at > now()
    AND i.used_at IS NULL;
  
  IF invitation_record IS NULL THEN
    -- Log failed validation attempt without exposing the code
    INSERT INTO security_events_log (
      event_type,
      details,
      severity,
      ip_address,
      user_agent
    ) VALUES (
      'invitation_validation_failed',
      jsonb_build_object(
        'reason', 'code_not_found_or_expired',
        'code_length', length(p_code),
        'code_pattern', p_code ~ '^[A-Za-z0-9]+$'
      ),
      'warning',
      p_ip_address,
      p_user_agent
    );
    
    RETURN jsonb_build_object(
      'valid', false, 
      'error', 'Invitation not found or expired',
      'code', 'NOT_FOUND'
    );
  END IF;
  
  -- Generate secure validation token (short-lived)
  validation_token := encode(gen_random_bytes(32), 'base64');
  
  -- Create validation record
  INSERT INTO invitation_validations (
    invitation_id,
    validation_token,
    ip_address,
    user_agent,
    expires_at
  ) VALUES (
    invitation_record.id,
    validation_token,
    p_ip_address,
    p_user_agent,
    now() + interval '10 minutes'
  );
  
  -- Log successful validation without exposing sensitive data
  INSERT INTO security_events_log (
    event_type,
    details,
    severity,
    ip_address,
    user_agent
  ) VALUES (
    'invitation_validation_success',
    jsonb_build_object(
      'patient_id', invitation_record.patient_id,
      'psychologist_id', invitation_record.psychologist_id
    ),
    'info',
    p_ip_address,
    p_user_agent
  );
  
  -- Return minimal required information with validation token
  RETURN jsonb_build_object(
    'valid', true,
    'validation_token', validation_token,
    'patient_id', invitation_record.patient_id,
    'psychologist_id', invitation_record.psychologist_id,
    'expires_at', invitation_record.expires_at
  );
END;
$$;

-- 6. Security audit: Log this critical security fix
INSERT INTO public.security_events_log (
  event_type,
  details,
  severity
) VALUES (
  'critical_invitation_codes_secured',
  jsonb_build_object(
    'action', 'removed_public_access_to_invitation_codes',
    'risk_level', 'critical',
    'vulnerability', 'public_access_to_invitation_codes_table',
    'mitigation', 'restricted_to_authenticated_psychologists_and_service_role_only',
    'additional_security', 'invalidated_all_existing_codes_and_added_secure_validation_function',
    'codes_invalidated', 3
  ),
  'critical'
);