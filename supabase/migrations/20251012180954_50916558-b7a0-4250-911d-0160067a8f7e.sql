-- Fix search_path for log_privacy_level_change function
CREATE OR REPLACE FUNCTION log_privacy_level_change()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;