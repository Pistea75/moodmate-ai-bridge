-- Allow service role to read AI patient profiles for edge functions
CREATE POLICY "Service role can read AI patient profiles" ON ai_patient_profiles
FOR SELECT 
USING (true);