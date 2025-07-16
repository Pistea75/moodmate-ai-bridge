-- Fix remaining security issues from linter
-- Update all functions to have proper search_path

CREATE OR REPLACE FUNCTION public.sync_user_email()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.profiles 
  SET email = auth_users.email
  FROM auth.users auth_users
  WHERE profiles.id = auth_users.id
  AND profiles.email IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_mood_alert_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  clinician_id UUID;
  patient_name TEXT;
BEGIN
  IF NEW.mood_score <= 2 THEN
    SELECT pcl.clinician_id INTO clinician_id
    FROM patient_clinician_links pcl
    WHERE pcl.patient_id = NEW.patient_id;
    
    SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
    FROM profiles
    WHERE id = NEW.patient_id;
    
    IF clinician_id IS NOT NULL THEN
      INSERT INTO public.notifications (
        user_id, type, title, description, priority, metadata
      ) VALUES (
        clinician_id, 'alert', 'Low Mood Alert',
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
$$;

CREATE OR REPLACE FUNCTION public.create_session_notifications()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  patient_name TEXT;
BEGIN
  SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
  FROM profiles
  WHERE id = NEW.patient_id;
  
  INSERT INTO public.notifications (
    user_id, type, title, description, priority, metadata
  ) VALUES (
    NEW.clinician_id, 'session', 'Upcoming Session',
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
$$;

CREATE OR REPLACE FUNCTION public.create_task_completion_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  patient_name TEXT;
BEGIN
  IF OLD.completed = false AND NEW.completed = true AND NEW.patient_id IS NOT NULL THEN
    SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
    FROM profiles
    WHERE id = NEW.patient_id;
    
    INSERT INTO public.notifications (
      user_id, type, title, description, priority, metadata
    ) VALUES (
      NEW.clinician_id, 'task', 'Task Completed',
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
$$;