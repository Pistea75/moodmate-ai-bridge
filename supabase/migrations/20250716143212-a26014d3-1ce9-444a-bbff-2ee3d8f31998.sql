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