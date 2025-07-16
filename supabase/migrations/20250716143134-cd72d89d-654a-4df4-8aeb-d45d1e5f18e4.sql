-- Phase 1: Critical Security & Database Fixes

-- Fix RLS policies for clinician_referral_codes (currently has no policies)
ALTER TABLE public.clinician_referral_codes ENABLE ROW LEVEL SECURITY;

-- Allow clinicians to view their own referral code
CREATE POLICY "Clinicians can view their own referral code"
ON public.clinician_referral_codes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow anon users to check if referral codes exist (for signup validation)
CREATE POLICY "Allow anon users to check referral codes"
ON public.clinician_referral_codes
FOR SELECT
TO anon
USING (true);

-- Fix RLS policies for ai_patient_profiles (currently has no policies)
ALTER TABLE public.ai_patient_profiles ENABLE ROW LEVEL SECURITY;

-- Allow clinicians to manage AI profiles for their patients
CREATE POLICY "Clinicians can manage AI profiles for their patients"
ON public.ai_patient_profiles
FOR ALL
TO authenticated
USING (auth.uid() = clinician_id)
WITH CHECK (auth.uid() = clinician_id);

-- Allow patients to view their AI profile
CREATE POLICY "Patients can view their AI profile"
ON public.ai_patient_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

-- Add missing DELETE policies for critical tables
CREATE POLICY "Clinicians can delete their patients' risk assessments"
ON public.patient_risk_assessments
FOR DELETE
TO authenticated
USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete their sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (auth.uid() = clinician_id);

CREATE POLICY "Patients can delete their exercise logs"
ON public.exercise_logs
FOR DELETE
TO authenticated
USING (auth.uid() = patient_id);

CREATE POLICY "Clinicians can delete exercise logs for their patients"
ON public.exercise_logs
FOR DELETE
TO authenticated
USING (EXISTS (
  SELECT 1 FROM patient_clinician_links
  WHERE patient_clinician_links.patient_id = exercise_logs.patient_id
  AND patient_clinician_links.clinician_id = auth.uid()
));

CREATE POLICY "Users can delete their notifications"
ON public.notifications
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Fix patient_clinician_links to allow proper management
CREATE POLICY "Clinicians can create patient links"
ON public.patient_clinician_links
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can update patient links"
ON public.patient_clinician_links
FOR UPDATE
TO authenticated
USING (auth.uid() = clinician_id)
WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete patient links"
ON public.patient_clinician_links
FOR DELETE
TO authenticated
USING (auth.uid() = clinician_id);

-- Update database functions to include proper search_path and security
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_temp
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Update existing functions to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
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
  RETURN NEW;
END;
$$;

-- Update other security definer functions
CREATE OR REPLACE FUNCTION public.link_patient_to_clinician()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  clinician_id uuid;
BEGIN
  IF NEW.role = 'patient' AND NEW.referral_code IS NOT NULL THEN
    SELECT id INTO clinician_id 
    FROM profiles 
    WHERE role = 'clinician' 
      AND referral_code = NEW.referral_code;
    
    IF clinician_id IS NOT NULL THEN
      INSERT INTO patient_clinician_links (patient_id, clinician_id)
      VALUES (NEW.id, clinician_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;