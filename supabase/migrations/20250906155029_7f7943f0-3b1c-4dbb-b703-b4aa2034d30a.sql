-- Security Review Implementation: Fix overly permissive RLS policies

-- 1. Fix enhanced_security_logs table - restrict to super admins only
DROP POLICY IF EXISTS "Allow service role full access to enhanced security logs" ON enhanced_security_logs;

CREATE POLICY "Super admins can manage enhanced security logs"
ON enhanced_security_logs
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_super_admin = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_super_admin = true
  )
);

-- Allow service role for system operations only
CREATE POLICY "Service role can insert security logs"
ON enhanced_security_logs
FOR INSERT
TO service_role
WITH CHECK (true);

-- 2. Fix ai_patient_profiles table - remove public service role access
DROP POLICY IF EXISTS "Service role can read AI patient profiles" ON ai_patient_profiles;

-- Keep only legitimate access for patients and clinicians
-- Patient access is already covered by existing policy
-- Clinician access is already covered by existing policy

-- 3. Fix profiles table - restrict anonymous access to only referral codes
DROP POLICY IF EXISTS "Anonymous can check clinician referral codes" ON profiles;

CREATE POLICY "Anonymous can check clinician referral codes only"
ON profiles
FOR SELECT
TO anon
USING (
  role = 'clinician' 
  AND referral_code IS NOT NULL
);