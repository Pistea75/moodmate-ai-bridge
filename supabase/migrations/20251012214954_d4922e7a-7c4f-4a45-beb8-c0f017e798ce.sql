-- Drop the existing restrictive policy
DROP POLICY IF EXISTS "Clinicians can view logs based on privacy level" ON ai_chat_logs;

-- Create new policy that allows access for both partial_share and full_share
CREATE POLICY "Clinicians can view logs based on privacy level" 
ON ai_chat_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1
    FROM patient_clinician_links pcl
    JOIN subscribers s ON s.user_id = pcl.patient_id
    WHERE pcl.patient_id = ai_chat_logs.patient_id 
      AND pcl.clinician_id = auth.uid() 
      AND s.privacy_level IN ('partial_share', 'full_share')
  )
);