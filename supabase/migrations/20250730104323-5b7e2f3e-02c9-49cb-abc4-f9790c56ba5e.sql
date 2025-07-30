-- Fix infinite recursion in profiles RLS policies
-- Drop all existing problematic policies
DROP POLICY IF EXISTS "Users can view their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles; 
DROP POLICY IF EXISTS "Users can insert their profile" ON profiles;
DROP POLICY IF EXISTS "Clinicians can view their patients" ON profiles;
DROP POLICY IF EXISTS "Allow anon users to check referral codes" ON profiles;
DROP POLICY IF EXISTS "Service role has full access to profiles" ON profiles;

-- Create a security definer function to get user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create a security definer function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path TO 'public', 'pg_temp'
AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$;

-- Create simple, non-recursive RLS policies
CREATE POLICY "Users can view their own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"  
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON profiles FOR INSERT  
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow service role full access (for functions and system operations)
CREATE POLICY "Service role has full access"
ON profiles FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow anonymous users to check referral codes for signup
CREATE POLICY "Anonymous can check clinician referral codes"
ON profiles FOR SELECT
TO anon
USING (role = 'clinician' AND referral_code IS NOT NULL);

-- Super admins can view all profiles using the safe function
CREATE POLICY "Super admins can view all profiles"
ON profiles FOR SELECT
TO authenticated  
USING (public.is_super_admin());

-- Clinicians can view patients linked to them via patient_clinician_links
CREATE POLICY "Clinicians can view their assigned patients"
ON profiles FOR SELECT
TO authenticated
USING (
  role = 'patient' AND EXISTS (
    SELECT 1 FROM patient_clinician_links pcl 
    WHERE pcl.patient_id = profiles.id 
    AND pcl.clinician_id = auth.uid()
  )
);