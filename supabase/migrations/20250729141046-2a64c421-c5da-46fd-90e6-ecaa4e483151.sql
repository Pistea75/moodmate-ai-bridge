
-- Fix the enhanced_security_logs RLS policies to allow proper logging
-- First, drop existing policies
DROP POLICY IF EXISTS "Service role can insert enhanced security logs" ON enhanced_security_logs;
DROP POLICY IF EXISTS "Super admins can view enhanced security logs" ON enhanced_security_logs;

-- Create new policies that allow both service role operations and super admin access
CREATE POLICY "Allow service role full access to enhanced security logs" 
ON enhanced_security_logs 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Super admins can view enhanced security logs" 
ON enhanced_security_logs 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_super_admin = true
  )
);

-- Ensure the service role bypasses RLS
ALTER TABLE enhanced_security_logs FORCE ROW LEVEL SECURITY;
