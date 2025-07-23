
-- Create Brodi interactions table to track all appearances and user responses
CREATE TABLE public.brodi_interactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL, -- 'nudge', 'celebration', 'random', 'mood_reminder', 'task_reminder'
  message TEXT NOT NULL,
  user_response TEXT, -- 'dismissed', 'engaged', 'completed_action', 'ignored'
  context_data JSONB DEFAULT '{}', -- Store context like mood scores, task data, etc.
  effectiveness_score INTEGER, -- 1-10 rating of how effective the interaction was
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  responded_at TIMESTAMP WITH TIME ZONE
);

-- Create Brodi user preferences table
CREATE TABLE public.brodi_user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  frequency_preference TEXT NOT NULL DEFAULT 'normal', -- 'minimal', 'normal', 'frequent'
  interaction_style TEXT NOT NULL DEFAULT 'friendly', -- 'professional', 'friendly', 'casual'
  nudge_enabled BOOLEAN NOT NULL DEFAULT true,
  celebration_enabled BOOLEAN NOT NULL DEFAULT true,
  mood_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
  task_reminders_enabled BOOLEAN NOT NULL DEFAULT true,
  quiet_hours_start TIME,
  quiet_hours_end TIME,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Brodi pattern analysis table for AI insights
CREATE TABLE public.brodi_pattern_analysis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pattern_type TEXT NOT NULL, -- 'mood_timing', 'task_completion', 'engagement', 'response_effectiveness'
  analysis_data JSONB NOT NULL, -- Store AI analysis results
  confidence_score REAL NOT NULL, -- 0-1 confidence in the pattern
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Brodi nudge history for tracking timing and success
CREATE TABLE public.brodi_nudge_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nudge_type TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  actual_time TIMESTAMP WITH TIME ZONE,
  success BOOLEAN,
  user_action TEXT, -- What action the user took after the nudge
  context_score REAL, -- How relevant was the timing (0-1)
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for Brodi interactions
ALTER TABLE public.brodi_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own Brodi interactions"
  ON public.brodi_interactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Brodi interactions"
  ON public.brodi_interactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Brodi interactions"
  ON public.brodi_interactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Clinicians can view their patients' Brodi interactions"
  ON public.brodi_interactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM patient_clinician_links pcl
    WHERE pcl.patient_id = brodi_interactions.user_id
    AND pcl.clinician_id = auth.uid()
  ));

-- Add RLS policies for Brodi user preferences
ALTER TABLE public.brodi_user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own Brodi preferences"
  ON public.brodi_user_preferences FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add RLS policies for Brodi pattern analysis
ALTER TABLE public.brodi_pattern_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pattern analysis"
  ON public.brodi_pattern_analysis FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage pattern analysis"
  ON public.brodi_pattern_analysis FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Clinicians can view their patients' pattern analysis"
  ON public.brodi_pattern_analysis FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM patient_clinician_links pcl
    WHERE pcl.patient_id = brodi_pattern_analysis.user_id
    AND pcl.clinician_id = auth.uid()
  ));

-- Add RLS policies for Brodi nudge history
ALTER TABLE public.brodi_nudge_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own nudge history"
  ON public.brodi_nudge_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can manage nudge history"
  ON public.brodi_nudge_history FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add indexes for performance
CREATE INDEX idx_brodi_interactions_user_id ON public.brodi_interactions(user_id);
CREATE INDEX idx_brodi_interactions_type ON public.brodi_interactions(interaction_type);
CREATE INDEX idx_brodi_interactions_created_at ON public.brodi_interactions(created_at);
CREATE INDEX idx_brodi_pattern_analysis_user_id ON public.brodi_pattern_analysis(user_id);
CREATE INDEX idx_brodi_pattern_analysis_type ON public.brodi_pattern_analysis(pattern_type);
CREATE INDEX idx_brodi_nudge_history_user_id ON public.brodi_nudge_history(user_id);
CREATE INDEX idx_brodi_nudge_history_scheduled_time ON public.brodi_nudge_history(scheduled_time);
