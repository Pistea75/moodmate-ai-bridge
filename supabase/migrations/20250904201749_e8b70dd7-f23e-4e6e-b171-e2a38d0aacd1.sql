-- Add RLS policy to allow clinicians to log AI chats for their patients
CREATE POLICY "Clinicians can log AI chats for their patients" ON ai_chat_logs
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM patient_clinician_links pcl
    WHERE pcl.patient_id = ai_chat_logs.patient_id 
    AND pcl.clinician_id = auth.uid()
  )
);