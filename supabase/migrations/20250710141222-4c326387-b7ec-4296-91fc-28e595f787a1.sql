-- Add session templates and enhanced session management
CREATE TABLE IF NOT EXISTS public.session_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  clinician_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  session_type TEXT NOT NULL DEFAULT 'individual',
  default_notes TEXT,
  preparation_checklist TEXT[],
  outcome_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add session outcomes tracking
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS outcome_rating INTEGER CHECK (outcome_rating >= 1 AND outcome_rating <= 5),
ADD COLUMN IF NOT EXISTS outcome_notes TEXT,
ADD COLUMN IF NOT EXISTS homework_assigned TEXT,
ADD COLUMN IF NOT EXISTS next_session_focus TEXT,
ADD COLUMN IF NOT EXISTS attendance_status TEXT DEFAULT 'scheduled' CHECK (attendance_status IN ('scheduled', 'attended', 'no_show', 'cancelled', 'rescheduled')),
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS session_template_id UUID REFERENCES session_templates(id);

-- Enable RLS on session_templates
ALTER TABLE public.session_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies for session_templates
CREATE POLICY "Clinicians can view their own templates" 
ON public.session_templates 
FOR SELECT 
USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can create their own templates" 
ON public.session_templates 
FOR INSERT 
WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can update their own templates" 
ON public.session_templates 
FOR UPDATE 
USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can delete their own templates" 
ON public.session_templates 
FOR DELETE 
USING (auth.uid() = clinician_id);

-- Create function to send session reminders
CREATE OR REPLACE FUNCTION public.check_upcoming_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create notifications for sessions happening in the next 24 hours that haven't been reminded
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    description,
    priority,
    metadata
  )
  SELECT 
    s.clinician_id,
    'session_reminder',
    'Upcoming Session Reminder',
    'Session with ' || COALESCE(p.first_name || ' ' || p.last_name, 'Patient') || ' is scheduled for ' || 
    to_char(s.scheduled_time, 'YYYY-MM-DD at HH24:MI'),
    'high',
    jsonb_build_object(
      'session_id', s.id,
      'patient_id', s.patient_id,
      'scheduled_time', s.scheduled_time
    )
  FROM sessions s
  LEFT JOIN profiles p ON p.id = s.patient_id
  WHERE s.scheduled_time BETWEEN now() AND now() + interval '24 hours'
    AND s.reminder_sent_at IS NULL
    AND s.attendance_status = 'scheduled';
    
  -- Update reminder_sent_at timestamp
  UPDATE sessions 
  SET reminder_sent_at = now()
  WHERE scheduled_time BETWEEN now() AND now() + interval '24 hours'
    AND reminder_sent_at IS NULL
    AND attendance_status = 'scheduled';
END;
$$;

-- Create default session templates
INSERT INTO public.session_templates (clinician_id, name, description, duration_minutes, session_type, default_notes, preparation_checklist, outcome_metrics)
SELECT 
  p.id as clinician_id,
  template.name,
  template.description,
  template.duration_minutes,
  template.session_type,
  template.default_notes,
  template.preparation_checklist,
  template.outcome_metrics
FROM profiles p
CROSS JOIN (
  VALUES
    ('Initial Consultation', 'Comprehensive intake and assessment session', 90, 'initial', 
     'Patient background, presenting concerns, treatment goals, and initial assessment',
     ARRAY['Review patient intake forms', 'Prepare assessment tools', 'Set up welcoming environment'],
     '{"mood_improvement": "1-5", "engagement_level": "1-5", "treatment_readiness": "1-5"}'::jsonb),
    ('Follow-up Session', 'Regular therapy session with progress review', 50, 'individual',
     'Progress review, therapeutic interventions, homework review',
     ARRAY['Review previous session notes', 'Check homework completion', 'Prepare intervention materials'],
     '{"progress_rating": "1-5", "homework_completion": "1-5", "therapeutic_alliance": "1-5"}'::jsonb),
    ('Crisis Intervention', 'Emergency or crisis-focused session', 60, 'crisis',
     'Safety assessment, crisis stabilization, immediate coping strategies',
     ARRAY['Ensure safe environment', 'Have crisis resources ready', 'Review safety protocols'],
     '{"safety_level": "1-5", "stabilization": "1-5", "support_system": "1-5"}'::jsonb),
    ('Group Therapy', 'Group therapeutic session', 75, 'group',
     'Group dynamics, shared learning, peer support',
     ARRAY['Prepare group activities', 'Review group rules', 'Plan group discussion topics'],
     '{"group_participation": "1-5", "peer_interaction": "1-5", "insight_development": "1-5"}'::jsonb),
    ('Family Session', 'Family or couples therapy session', 75, 'family',
     'Family dynamics, communication patterns, relationship goals',
     ARRAY['Review family history', 'Prepare family activities', 'Set communication guidelines'],
     '{"communication_improvement": "1-5", "family_cohesion": "1-5", "conflict_resolution": "1-5"}'::jsonb)
) AS template(name, description, duration_minutes, session_type, default_notes, preparation_checklist, outcome_metrics)
WHERE p.role = 'clinician'
ON CONFLICT DO NOTHING;