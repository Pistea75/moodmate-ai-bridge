
-- Create notifications table for storing system notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('session', 'task', 'alert', 'message', 'system')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to automatically create mood alert notifications
CREATE OR REPLACE FUNCTION public.create_mood_alert_notification()
RETURNS TRIGGER AS $$
DECLARE
  clinician_id UUID;
  patient_name TEXT;
BEGIN
  -- Only create notification for low mood scores (≤ 2) 
  IF NEW.mood_score <= 2 THEN
    -- Find the clinician for this patient
    SELECT pcl.clinician_id INTO clinician_id
    FROM patient_clinician_links pcl
    WHERE pcl.patient_id = NEW.patient_id;
    
    -- Get patient name
    SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
    FROM profiles
    WHERE id = NEW.patient_id;
    
    -- Create notification for clinician if found
    IF clinician_id IS NOT NULL THEN
      INSERT INTO public.notifications (
        user_id,
        type,
        title,
        description,
        priority,
        metadata
      ) VALUES (
        clinician_id,
        'alert',
        'Low Mood Alert',
        'Patient ' || COALESCE(patient_name, 'Unknown') || ' reported mood score of ' || NEW.mood_score || '/10',
        'high',
        jsonb_build_object(
          'patient_id', NEW.patient_id,
          'mood_score', NEW.mood_score,
          'patient_name', patient_name
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for mood alerts
CREATE TRIGGER mood_alert_notification_trigger
  AFTER INSERT ON public.mood_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.create_mood_alert_notification();

-- Create function for upcoming session notifications
CREATE OR REPLACE FUNCTION public.create_session_notifications()
RETURNS TRIGGER AS $$
DECLARE
  patient_name TEXT;
BEGIN
  -- Get patient name
  SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
  FROM profiles
  WHERE id = NEW.patient_id;
  
  -- Create notification for clinician
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    description,
    priority,
    metadata
  ) VALUES (
    NEW.clinician_id,
    'session',
    'Upcoming Session',
    'Session with ' || COALESCE(patient_name, 'Unknown Patient') || ' in 30 minutes',
    'high',
    jsonb_build_object(
      'session_id', NEW.id,
      'patient_id', NEW.patient_id,
      'patient_name', patient_name,
      'scheduled_time', NEW.scheduled_time
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function for task completion notifications
CREATE OR REPLACE FUNCTION public.create_task_completion_notification()
RETURNS TRIGGER AS $$
DECLARE
  patient_name TEXT;
BEGIN
  -- Only trigger when task is marked as completed
  IF OLD.completed = false AND NEW.completed = true AND NEW.patient_id IS NOT NULL THEN
    -- Get patient name
    SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
    FROM profiles
    WHERE id = NEW.patient_id;
    
    -- Create notification for clinician
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      description,
      priority,
      metadata
    ) VALUES (
      NEW.clinician_id,
      'task',
      'Task Completed',
      COALESCE(patient_name, 'Patient') || ' completed: ' || NEW.title,
      'medium',
      jsonb_build_object(
        'task_id', NEW.id,
        'patient_id', NEW.patient_id,
        'patient_name', patient_name,
        'task_title', NEW.title
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for task completion notifications
CREATE TRIGGER task_completion_notification_trigger
  AFTER UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.create_task_completion_notification();

-- Create index for better performance
CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read, created_at DESC);
