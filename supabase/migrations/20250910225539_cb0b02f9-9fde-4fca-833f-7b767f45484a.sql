-- CRITICAL SECURITY FIX: Remove all public access to profiles table and fix infinite recursion

-- 1. Drop all dangerous public policies
DROP POLICY IF EXISTS "clinician_discovery_public_read" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_read_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- 2. Create security definer function to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Create security definer function to check super admin status
CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$;

-- 4. Create secure policies with proper authentication requirements
-- Only authenticated users can read their own profile
CREATE POLICY "profiles_read_own_authenticated" ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Only authenticated users can update their own profile
CREATE POLICY "profiles_update_own_authenticated" ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Super admins can view all profiles (using security definer function)
CREATE POLICY "profiles_super_admin_read_all" ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.is_current_user_super_admin());

-- 5. Create a separate secure table for public clinician discovery (SAFE FIELDS ONLY)
CREATE TABLE IF NOT EXISTS public.clinician_marketplace (
  id uuid PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  specializations text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  region text,
  experience_years integer,
  bio text,
  hourly_rate numeric,
  is_accepting_patients boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on marketplace table
ALTER TABLE public.clinician_marketplace ENABLE ROW LEVEL SECURITY;

-- Allow public read access to marketplace (SAFE FIELDS ONLY)
CREATE POLICY "marketplace_public_read" ON public.clinician_marketplace 
FOR SELECT 
TO public
USING (is_accepting_patients = true);

-- Only profile owners can manage their marketplace entry
CREATE POLICY "marketplace_owner_manage" ON public.clinician_marketplace 
FOR ALL 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 6. Drop the old unsafe view
DROP VIEW IF EXISTS public.clinician_discovery;

-- 7. Create a trigger to sync safe data to marketplace table
CREATE OR REPLACE FUNCTION public.sync_clinician_marketplace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only sync for clinician/psychologist profiles
  IF NEW.role IN ('clinician', 'psychologist') AND NEW.status = 'active' THEN
    INSERT INTO public.clinician_marketplace (
      id, 
      display_name, 
      specializations, 
      languages, 
      region,
      is_accepting_patients
    ) VALUES (
      NEW.id,
      COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''),
      CASE WHEN NEW.role = 'psychologist' THEN ARRAY['Psychology'] ELSE ARRAY['Mental Health'] END,
      CASE WHEN NEW.language = 'es' THEN ARRAY['Spanish'] ELSE ARRAY['English'] END,
      'Argentina', -- Default region, should be updated to use actual region field
      true
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      languages = EXCLUDED.languages,
      updated_at = now();
  ELSIF OLD.role IN ('clinician', 'psychologist') THEN
    -- Remove from marketplace if role changed or status changed
    DELETE FROM public.clinician_marketplace WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for syncing
DROP TRIGGER IF EXISTS sync_clinician_marketplace_trigger ON public.profiles;
CREATE TRIGGER sync_clinician_marketplace_trigger
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_clinician_marketplace();

-- 8. Migrate existing clinician data to marketplace (SAFE FIELDS ONLY)
INSERT INTO public.clinician_marketplace (
  id, 
  display_name, 
  specializations, 
  languages, 
  region,
  is_accepting_patients
)
SELECT 
  id,
  COALESCE(first_name, '') || ' ' || COALESCE(last_name, ''),
  CASE WHEN role = 'psychologist' THEN ARRAY['Psychology'] ELSE ARRAY['Mental Health'] END,
  CASE WHEN language = 'es' THEN ARRAY['Spanish'] ELSE ARRAY['English'] END,
  'Argentina',
  true
FROM public.profiles 
WHERE role IN ('clinician', 'psychologist') 
  AND status = 'active'
ON CONFLICT (id) DO NOTHING;

-- 9. Security audit: Log this critical security fix
INSERT INTO public.security_events_log (
  event_type,
  details,
  severity
) VALUES (
  'critical_security_fix_profiles_exposure',
  jsonb_build_object(
    'action', 'removed_public_access_to_profiles_table',
    'risk_level', 'critical',
    'affected_fields', ARRAY['email', 'phone', 'emergency_contact_name', 'emergency_contact_phone'],
    'mitigation', 'created_separate_marketplace_table_with_safe_fields_only'
  ),
  'critical'
);