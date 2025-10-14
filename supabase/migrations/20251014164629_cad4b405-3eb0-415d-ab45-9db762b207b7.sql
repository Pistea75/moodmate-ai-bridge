-- Update the handle_new_user function to create link requests instead of direct links
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clinician_id uuid;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (
    id,
    first_name,
    last_name,
    language,
    role,
    referral_code,
    email,
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
    NEW.email,
    NOW(),
    NOW()
  );

  -- If user has a referral code and is a patient, create a pending link request
  IF NEW.raw_user_meta_data ->> 'referral_code' IS NOT NULL 
     AND COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient') = 'patient' THEN
    
    -- Find the clinician with this referral code
    SELECT id INTO v_clinician_id
    FROM public.profiles
    WHERE referral_code = NEW.raw_user_meta_data ->> 'referral_code'
      AND role IN ('clinician', 'psychologist')
    LIMIT 1;

    -- If clinician found, create a pending link request
    IF v_clinician_id IS NOT NULL THEN
      INSERT INTO public.patient_link_requests (
        patient_id,
        clinician_id,
        referral_code,
        status
      )
      VALUES (
        NEW.id,
        v_clinician_id,
        NEW.raw_user_meta_data ->> 'referral_code',
        'pending'
      )
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;