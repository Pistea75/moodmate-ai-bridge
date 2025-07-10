-- Add new columns to sessions table for video calling and recording
ALTER TABLE sessions 
ADD COLUMN session_type text DEFAULT 'in_person' CHECK (session_type IN ('online', 'in_person')),
ADD COLUMN recording_enabled boolean DEFAULT false,
ADD COLUMN recording_status text DEFAULT 'none' CHECK (recording_status IN ('none', 'recording', 'processing', 'completed', 'failed')),
ADD COLUMN recording_file_path text,
ADD COLUMN transcription_status text DEFAULT 'none' CHECK (transcription_status IN ('none', 'pending', 'processing', 'completed', 'failed')),
ADD COLUMN transcription_text text,
ADD COLUMN ai_report_status text DEFAULT 'none' CHECK (ai_report_status IN ('none', 'pending', 'processing', 'completed', 'failed')),
ADD COLUMN ai_report_id uuid REFERENCES ai_chat_reports(id),
ADD COLUMN video_call_url text,
ADD COLUMN video_call_room_id text;

-- Create table for session recordings metadata
CREATE TABLE session_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  file_path text NOT NULL,
  file_size bigint,
  duration_seconds integer,
  recording_started_at timestamp with time zone,
  recording_ended_at timestamp with time zone,
  transcription_job_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on session_recordings
ALTER TABLE session_recordings ENABLE ROW LEVEL SECURITY;

-- Create policies for session_recordings
CREATE POLICY "Clinicians can view their session recordings"
ON session_recordings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_recordings.session_id 
    AND sessions.clinician_id = auth.uid()
  )
);

CREATE POLICY "Clinicians can create session recordings"
ON session_recordings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_recordings.session_id 
    AND sessions.clinician_id = auth.uid()
  )
);

CREATE POLICY "Clinicians can update their session recordings"
ON session_recordings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_recordings.session_id 
    AND sessions.clinician_id = auth.uid()
  )
);

CREATE POLICY "Clinicians can delete their session recordings"
ON session_recordings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM sessions 
    WHERE sessions.id = session_recordings.session_id 
    AND sessions.clinician_id = auth.uid()
  )
);

-- Create function to clean up recordings after AI report is generated
CREATE OR REPLACE FUNCTION cleanup_session_recording()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- When AI report status changes to 'completed', mark recording for cleanup
  IF OLD.ai_report_status != 'completed' AND NEW.ai_report_status = 'completed' THEN
    -- Update recording status to indicate it can be deleted
    UPDATE session_recordings 
    SET updated_at = now()
    WHERE session_id = NEW.id;
    
    -- You could also trigger a background job here to actually delete the file
    -- For now, we'll handle this in the application layer
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic cleanup
CREATE TRIGGER session_recording_cleanup_trigger
  AFTER UPDATE ON sessions
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_session_recording();

-- Add updated_at trigger for session_recordings
CREATE TRIGGER update_session_recordings_updated_at
  BEFORE UPDATE ON session_recordings
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();