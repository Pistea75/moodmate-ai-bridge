
-- Drop the problematic SECURITY DEFINER view
DROP VIEW IF EXISTS public.clinician_referral_codes;

-- Update the RLS policy that was referencing the view to query the profiles table directly
DROP POLICY IF EXISTS "Clinicians can view their patients" ON public.profiles;

-- Create a new policy that directly queries profiles instead of using the view
CREATE POLICY "Clinicians can view their patients" ON public.profiles
FOR SELECT 
USING (
  -- Allow clinicians to view patients who have their referral code
  (role = 'clinician' AND auth.uid() = id) OR
  -- Allow patients to be viewed by their linked clinician
  (role = 'patient' AND EXISTS (
    SELECT 1 FROM patient_clinician_links pcl 
    WHERE pcl.patient_id = profiles.id 
    AND pcl.clinician_id = auth.uid()
  ))
);
