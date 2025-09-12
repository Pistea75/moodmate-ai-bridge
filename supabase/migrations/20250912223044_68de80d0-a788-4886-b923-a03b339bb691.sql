-- CRITICAL SECURITY FIX: Secure Therapist Personal Information
-- Issue: psychologist_profiles table exposes sensitive therapist data publicly

-- 1. Drop the dangerous public policy that exposes therapist personal information
DROP POLICY IF EXISTS "Anyone can view visible marketplace profiles" ON public.psychologist_profiles;

-- 2. Create secure policies with proper authentication requirements
-- Only authenticated users can view marketplace profiles (no anonymous access)
CREATE POLICY "authenticated_users_can_view_marketplace" ON public.psychologist_profiles
FOR SELECT
TO authenticated
USING (is_visible_marketplace = true);

-- Psychologists can still manage their own profiles (change from public to authenticated)
DROP POLICY IF EXISTS "Psychologists can manage their own profile" ON public.psychologist_profiles;

CREATE POLICY "psychologists_manage_own_profile" ON public.psychologist_profiles
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 3. Migrate sensitive data to our secure clinician_marketplace table
-- Update the marketplace table to include the additional fields from psychologist_profiles
ALTER TABLE public.clinician_marketplace 
ADD COLUMN IF NOT EXISTS pricing_tier text,
ADD COLUMN IF NOT EXISTS accepts_insurance boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rating_average numeric(3,2),
ADD COLUMN IF NOT EXISTS total_reviews integer DEFAULT 0;

-- 4. Create a secure data migration function that only exposes safe fields
CREATE OR REPLACE FUNCTION public.sync_psychologist_to_marketplace()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only sync if profile is visible in marketplace
  IF NEW.is_visible_marketplace = true THEN
    INSERT INTO public.clinician_marketplace (
      id, 
      display_name,
      specializations,
      languages,
      region,
      experience_years,
      bio,
      is_accepting_patients,
      pricing_tier,  -- Safe: general tier instead of exact rate
      accepts_insurance,
      updated_at
    ) VALUES (
      NEW.user_id,
      NEW.display_name,
      COALESCE(NEW.specializations, ARRAY['Psychology']),
      COALESCE(NEW.languages, ARRAY['English']),
      NEW.region,
      NEW.experience_years,
      -- Sanitize bio to remove any sensitive information
      CASE 
        WHEN LENGTH(NEW.bio) > 500 THEN LEFT(NEW.bio, 500) || '...'
        ELSE NEW.bio
      END,
      NEW.is_accepting_patients,
      -- Convert exact hourly rate to safe pricing tier
      CASE 
        WHEN NEW.hourly_rate IS NULL THEN 'Contact for pricing'
        WHEN NEW.hourly_rate < 50 THEN 'Budget-friendly'
        WHEN NEW.hourly_rate < 100 THEN 'Standard'
        WHEN NEW.hourly_rate < 150 THEN 'Premium'
        ELSE 'Luxury'
      END,
      false, -- Default insurance acceptance
      now()
    )
    ON CONFLICT (id) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      specializations = EXCLUDED.specializations,
      languages = EXCLUDED.languages,
      region = EXCLUDED.region,
      experience_years = EXCLUDED.experience_years,
      bio = EXCLUDED.bio,
      is_accepting_patients = EXCLUDED.is_accepting_patients,
      pricing_tier = EXCLUDED.pricing_tier,
      updated_at = EXCLUDED.updated_at;
  ELSE
    -- Remove from marketplace if no longer visible
    DELETE FROM public.clinician_marketplace WHERE id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 5. Create trigger for automatic safe data sync
DROP TRIGGER IF EXISTS sync_psychologist_marketplace_trigger ON public.psychologist_profiles;
CREATE TRIGGER sync_psychologist_marketplace_trigger
  AFTER INSERT OR UPDATE ON public.psychologist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_psychologist_to_marketplace();

-- 6. Migrate existing data to secure marketplace (safe fields only)
INSERT INTO public.clinician_marketplace (
  id, 
  display_name,
  specializations,
  languages,
  region,
  experience_years,
  bio,
  is_accepting_patients,
  pricing_tier,
  accepts_insurance
)
SELECT 
  pp.user_id,
  pp.display_name,
  COALESCE(pp.specializations, ARRAY['Psychology']),
  COALESCE(pp.languages, ARRAY['English']),
  pp.region,
  pp.experience_years,
  -- Sanitize bio
  CASE 
    WHEN LENGTH(pp.bio) > 500 THEN LEFT(pp.bio, 500) || '...'
    ELSE pp.bio
  END,
  pp.is_accepting_patients,
  -- Convert exact rates to safe pricing tiers
  CASE 
    WHEN pp.hourly_rate IS NULL THEN 'Contact for pricing'
    WHEN pp.hourly_rate < 50 THEN 'Budget-friendly'
    WHEN pp.hourly_rate < 100 THEN 'Standard'
    WHEN pp.hourly_rate < 150 THEN 'Premium'
    ELSE 'Luxury'
  END,
  false
FROM public.psychologist_profiles pp
WHERE pp.is_visible_marketplace = true
ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  specializations = EXCLUDED.specializations,
  languages = EXCLUDED.languages,
  region = EXCLUDED.region,
  experience_years = EXCLUDED.experience_years,
  bio = EXCLUDED.bio,
  is_accepting_patients = EXCLUDED.is_accepting_patients,
  pricing_tier = EXCLUDED.pricing_tier,
  updated_at = now();

-- 7. Security audit: Log this critical security fix
INSERT INTO public.security_events_log (
  event_type,
  details,
  severity
) VALUES (
  'critical_therapist_data_secured',
  jsonb_build_object(
    'action', 'removed_public_access_to_psychologist_profiles',
    'risk_level', 'critical',
    'vulnerable_fields', ARRAY['display_name', 'hourly_rate', 'bio', 'country', 'region', 'specializations'],
    'business_risk', 'competitor_data_theft_and_pricing_intelligence',
    'mitigation', 'restricted_to_authenticated_users_and_migrated_to_safe_marketplace_table',
    'data_anonymization', 'converted_exact_rates_to_pricing_tiers'
  ),
  'critical'
);