-- Allow patients to view their assigned clinician's profile
CREATE POLICY "Patients can view their assigned clinician profile"
ON profiles
FOR SELECT
USING (
  role = 'psychologist' AND EXISTS (
    SELECT 1 FROM patient_clinician_links
    WHERE patient_clinician_links.clinician_id = profiles.id
    AND patient_clinician_links.patient_id = auth.uid()
  )
);