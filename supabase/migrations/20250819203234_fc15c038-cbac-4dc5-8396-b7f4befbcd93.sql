-- Create voice consent logs table
CREATE TABLE public.voice_consent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_given BOOLEAN NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version TEXT NOT NULL DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create voice usage logs table
CREATE TABLE public.voice_usage_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL DEFAULT auth.uid(),
  type TEXT NOT NULL, -- 'stt' or 'tts'
  duration_seconds INTEGER,
  language TEXT,
  method TEXT, -- 'webspeech', 'whisper_fallback', etc
  transcript_length INTEGER,
  cost_estimate DECIMAL(10,4) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.voice_consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for voice_consent_logs
CREATE POLICY "Users can manage their own voice consent" 
ON public.voice_consent_logs 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for voice_usage_logs
CREATE POLICY "Users can view their own voice usage" 
ON public.voice_usage_logs 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert voice usage logs" 
ON public.voice_usage_logs 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Clinicians can view their patients' voice usage"
ON public.voice_usage_logs
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM patient_clinician_links pcl
  WHERE pcl.patient_id = voice_usage_logs.user_id 
  AND pcl.clinician_id = auth.uid()
));

-- Indexes for performance
CREATE INDEX idx_voice_consent_logs_user_id ON public.voice_consent_logs(user_id);
CREATE INDEX idx_voice_consent_logs_consent_date ON public.voice_consent_logs(consent_date);
CREATE INDEX idx_voice_usage_logs_user_id ON public.voice_usage_logs(user_id);
CREATE INDEX idx_voice_usage_logs_created_at ON public.voice_usage_logs(created_at);