-- Allow authenticated users to read referral codes from clinician profiles
-- This is needed for patients to link with their psychologists
CREATE POLICY "Authenticated users can read clinician referral codes"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  role IN ('clinician', 'psychologist') 
  AND referral_code IS NOT NULL
);