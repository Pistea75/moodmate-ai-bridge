-- Add privacy level enum
CREATE TYPE privacy_level AS ENUM ('private', 'partial_share', 'full_share');

-- Add privacy_level to subscribers table
ALTER TABLE subscribers 
ADD COLUMN privacy_level privacy_level DEFAULT 'private';

-- Update existing users based on their current share_chat_with_clinician setting
UPDATE subscribers 
SET privacy_level = CASE 
  WHEN share_chat_with_clinician = true THEN 'full_share'::privacy_level
  ELSE 'private'::privacy_level
END;

-- Modify RLS policies for ai_chat_logs to respect privacy levels
-- Drop existing clinician view policy
DROP POLICY IF EXISTS "Clinicians can view logs of their assigned patients" ON ai_chat_logs;

-- Create new policy that checks privacy level
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
    AND s.privacy_level = 'full_share'
  )
);

-- Ensure clinicians can still view AI chat reports (insights) regardless of privacy level
-- This is already handled by existing RLS on ai_chat_reports table

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_privacy_level ON subscribers(privacy_level);

-- Update privacy_consent_logs to track privacy level changes
ALTER TABLE privacy_consent_logs
ADD COLUMN privacy_level privacy_level;

-- Create function to log privacy level changes
CREATE OR REPLACE FUNCTION log_privacy_level_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.privacy_level IS DISTINCT FROM NEW.privacy_level THEN
    INSERT INTO privacy_consent_logs (
      user_id,
      consent_type,
      consent_given,
      privacy_level,
      metadata
    ) VALUES (
      NEW.user_id,
      'privacy_level_change',
      true,
      NEW.privacy_level,
      jsonb_build_object(
        'old_level', OLD.privacy_level::text,
        'new_level', NEW.privacy_level::text,
        'timestamp', now()
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for logging privacy changes
DROP TRIGGER IF EXISTS log_privacy_change ON subscribers;
CREATE TRIGGER log_privacy_change
  AFTER UPDATE ON subscribers
  FOR EACH ROW
  EXECUTE FUNCTION log_privacy_level_change();