
-- Phase 1: Critical Database Security Fixes

-- Fix search_path security in existing functions
CREATE OR REPLACE FUNCTION public.cleanup_session_recording()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  -- When AI report status changes to 'completed', mark recording for cleanup
  IF OLD.ai_report_status != 'completed' AND NEW.ai_report_status = 'completed' THEN
    -- Update recording status to indicate it can be deleted
    UPDATE session_recordings 
    SET updated_at = now()
    WHERE session_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.link_patient_to_clinician()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
  clinician_id uuid;
BEGIN
  -- Only process if this is a patient with a referral code
  IF NEW.role = 'patient' AND NEW.referral_code IS NOT NULL THEN
    -- Find the clinician with this referral code
    SELECT id INTO clinician_id 
    FROM profiles 
    WHERE role = 'clinician' 
      AND referral_code = NEW.referral_code;
    
    -- If clinician found, create the link
    IF clinician_id IS NOT NULL THEN
      INSERT INTO patient_clinician_links (patient_id, clinician_id)
      VALUES (NEW.id, clinician_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_user_email()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE profiles 
  SET email = auth_users.email
  FROM auth.users auth_users
  WHERE profiles.id = auth_users.id
  AND profiles.email IS NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  UPDATE profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  INSERT INTO profiles (
    id, 
    first_name, 
    last_name, 
    language, 
    role,
    referral_code,
    email,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'language', 'en'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'patient'),
    NEW.raw_user_meta_data ->> 'referral_code',
    NEW.email,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.create_session_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
  patient_name TEXT;
BEGIN
  SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
  FROM profiles
  WHERE id = NEW.patient_id;
  
  INSERT INTO notifications (
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
$function$;

CREATE OR REPLACE FUNCTION public.create_mood_alert_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
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
      INSERT INTO notifications (
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
$function$;

CREATE OR REPLACE FUNCTION public.check_upcoming_sessions()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  -- Create notifications for sessions happening in the next 24 hours that haven't been reminded
  INSERT INTO notifications (
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
$function$;

CREATE OR REPLACE FUNCTION public.create_task_completion_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
DECLARE
  patient_name TEXT;
BEGIN
  IF OLD.completed = false AND NEW.completed = true AND NEW.patient_id IS NOT NULL THEN
    SELECT CONCAT(first_name, ' ', last_name) INTO patient_name
    FROM profiles
    WHERE id = NEW.patient_id;
    
    INSERT INTO notifications (
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
$function$;

-- Create secure role validation function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
 RETURNS TEXT
 LANGUAGE sql
 SECURITY DEFINER
 STABLE
 SET search_path = 'public', 'pg_temp'
AS $function$
  SELECT role FROM profiles WHERE id = auth.uid();
$function$;

-- Add role update protection
CREATE OR REPLACE FUNCTION public.validate_role_update()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = 'public', 'pg_temp'
AS $function$
BEGIN
  -- Prevent users from updating their own role unless they're super admin
  IF NEW.role != OLD.role AND OLD.id = auth.uid() THEN
    IF NOT OLD.is_super_admin THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for role update validation
DROP TRIGGER IF EXISTS validate_role_update_trigger ON profiles;
CREATE TRIGGER validate_role_update_trigger
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_role_update();

-- Create security audit log table
CREATE TABLE IF NOT EXISTS security_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  success BOOLEAN NOT NULL DEFAULT true,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security audit logs
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view security audit logs"
  ON security_audit_logs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND is_super_admin = true
  ));

-- System can insert audit logs
CREATE POLICY "System can insert security audit logs"
  ON security_audit_logs FOR INSERT
  WITH CHECK (true);
