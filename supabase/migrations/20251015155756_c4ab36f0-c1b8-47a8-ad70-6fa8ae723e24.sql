-- Allow clinicians to view profiles of patients who have sent them pending link requests
CREATE POLICY "Clinicians can view profiles of patients with pending requests"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  role = 'patient'
  AND EXISTS (
    SELECT 1
    FROM patient_link_requests plr
    WHERE plr.patient_id = profiles.id
      AND plr.clinician_id = auth.uid()
      AND plr.status = 'pending'
  )
);