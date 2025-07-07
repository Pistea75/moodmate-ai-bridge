
-- Fix existing user without role by setting default role
UPDATE profiles 
SET role = 'patient' 
WHERE role IS NULL;

-- Add NOT NULL constraint to role column to prevent future issues
ALTER TABLE profiles 
ALTER COLUMN role SET NOT NULL;

-- Set default value for role column
ALTER TABLE profiles 
ALTER COLUMN role SET DEFAULT 'patient';

-- Update the handle_new_user trigger to ensure complete profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    language, 
    role,
    referral_code,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient'),
    NEW.raw_user_meta_data ->> 'referral_code',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Create patient-clinician links for users with referral codes
CREATE OR REPLACE FUNCTION public.link_patient_to_clinician()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  clinician_id uuid;
BEGIN
  -- Only process if this is a patient with a referral code
  IF NEW.role = 'patient' AND NEW.referral_code IS NOT NULL THEN
    -- Find the clinician with this referral code
    SELECT id INTO clinician_id 
    FROM profiles 
    WHERE role = 'clinician' 
      AND referral_code = NEW.referral_code;
    
    -- If clinician found, create the link
    IF clinician_id IS NOT NULL THEN
      INSERT INTO patient_clinician_links (patient_id, clinician_id)
      VALUES (NEW.id, clinician_id)
      ON CONFLICT DO NOTHING; -- Prevent duplicate links
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically link patients to clinicians
DROP TRIGGER IF EXISTS on_profile_created_link_patient ON profiles;
CREATE TRIGGER on_profile_created_link_patient
  AFTER INSERT ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION public.link_patient_to_clinician();
