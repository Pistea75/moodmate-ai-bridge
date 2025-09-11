-- CRITICAL SECURITY FIX: Step-by-step secure remediation

-- 1. First, check what policies currently exist
DO $$
BEGIN
    -- Drop all problematic policies that expose PII
    DROP POLICY IF EXISTS "clinician_discovery_public_read" ON public.profiles;
    DROP POLICY IF EXISTS "profiles_admin_read_all" ON public.profiles;
    
    -- Don't drop these if they're the only safe ones remaining
    -- DROP POLICY IF EXISTS "profiles_read_own" ON public.profiles;
    -- DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
    
    RAISE NOTICE 'Dropped dangerous public policies';
END $$;

-- 2. Create security definer functions to avoid infinite recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.is_current_user_super_admin()
RETURNS BOOLEAN 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE 
SET search_path = public
AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = auth.uid();
$$;

-- 3. Create a completely separate table for public clinician discovery (SAFE FIELDS ONLY)
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

-- Allow public read access to marketplace (SAFE FIELDS ONLY - NO PII)
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

-- 4. Security audit: Log this critical security fix
INSERT INTO public.security_events_log (
  event_type,
  details,
  severity
) VALUES (
  'critical_pii_exposure_remediation',
  jsonb_build_object(
    'action', 'removed_dangerous_public_policies_from_profiles',
    'risk_level', 'critical',
    'vulnerable_fields', ARRAY['email', 'phone', 'emergency_contact_name', 'emergency_contact_phone', 'last_name', 'initial_assessment'],
    'mitigation', 'created_separate_marketplace_table_with_safe_fields_only',
    'impact', 'eliminated_public_access_to_all_pii'
  ),
  'critical'
);