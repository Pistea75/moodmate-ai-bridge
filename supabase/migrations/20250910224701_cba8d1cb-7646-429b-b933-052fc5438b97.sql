-- P1: Critical Security Fixes - Profiles PII Exposure and Invitation System Lockdown

-- 1. Drop the dangerous public policy on profiles table
DROP POLICY IF EXISTS "Public clinician discovery - safe fields only" ON public.profiles;

-- 2. Create a secure view for clinician discovery with only safe fields
CREATE OR REPLACE VIEW public.clinician_discovery AS 
SELECT 
  id,
  first_name as display_name,
  'Psychologist' as specializations, -- Placeholder, should be from separate specializations field
  CASE WHEN language = 'es' THEN ARRAY['Spanish'] ELSE ARRAY['English'] END as languages,
  'Argentina' as region -- Placeholder, should be from separate region field
FROM public.profiles 
WHERE role IN ('clinician', 'psychologist') 
  AND status = 'active';

-- 3. Revoke all public access from profiles table
REVOKE ALL ON public.profiles FROM anon;
REVOKE SELECT ON public.profiles FROM public;

-- 4. Create restrictive RLS policies for profiles
CREATE POLICY "profiles_read_own" ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow super admins to view all profiles
CREATE POLICY "profiles_admin_read_all" ON public.profiles 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.is_super_admin = true
));

-- 5. Secure patient_invitations table
-- Drop any existing public policies
DROP POLICY IF EXISTS "Service role can validate invitations" ON public.patient_invitations;

-- Create restrictive policies for invitations
CREATE POLICY "invitations_psychologist_only" ON public.patient_invitations 
FOR ALL 
USING (psychologist_id = auth.uid())
WITH CHECK (psychologist_id = auth.uid());

-- Service role can manage for edge functions
CREATE POLICY "invitations_service_role" ON public.patient_invitations 
FOR ALL 
USING (auth.role() = 'service_role');

-- 6. Invalidate all existing invitation codes for security
UPDATE public.patient_invitations 
SET expires_at = NOW() - INTERVAL '1 day', 
    used_at = NOW() 
WHERE used_at IS NULL;

-- 7. Create secure clinician discovery access
GRANT SELECT ON public.clinician_discovery TO anon, authenticated;

-- 8. Add rate limiting table for invitation validation
CREATE TABLE IF NOT EXISTS public.invitation_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address inet NOT NULL,
  attempts integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  blocked_until timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.invitation_rate_limits ENABLE ROW LEVEL SECURITY;

-- Service role can manage rate limits
CREATE POLICY "rate_limits_service_role" ON public.invitation_rate_limits 
FOR ALL 
USING (auth.role() = 'service_role');

-- 9. Create audit log for security events
CREATE TABLE IF NOT EXISTS public.security_events_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  user_id uuid,
  ip_address inet,
  user_agent text,
  details jsonb DEFAULT '{}',
  severity text DEFAULT 'info', -- info, warning, critical
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.security_events_log ENABLE ROW LEVEL SECURITY;

-- Only service role and super admins can access security events
CREATE POLICY "security_events_service_role" ON public.security_events_log 
FOR ALL 
USING (auth.role() = 'service_role');

CREATE POLICY "security_events_super_admin" ON public.security_events_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.is_super_admin = true
));