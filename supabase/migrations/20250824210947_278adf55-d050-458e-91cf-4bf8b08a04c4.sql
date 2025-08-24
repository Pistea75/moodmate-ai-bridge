-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.award_session_points()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Only award points for ratings of 4 or 5
  IF NEW.rating >= 4 THEN
    NEW.points_awarded := CASE 
      WHEN NEW.rating = 5 THEN 10
      WHEN NEW.rating = 4 THEN 5
      ELSE 0
    END;
    
    -- Update psychologist points
    INSERT INTO public.psychologist_points (psychologist_id, points_from_sessions, total_points)
    VALUES (NEW.psychologist_id, NEW.points_awarded, NEW.points_awarded)
    ON CONFLICT (psychologist_id) 
    DO UPDATE SET 
      points_from_sessions = psychologist_points.points_from_sessions + NEW.points_awarded,
      total_points = psychologist_points.total_points + NEW.points_awarded,
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.reset_daily_message_counts()
RETURNS void 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  UPDATE public.subscribers 
  SET 
    messages_used_today = 0,
    last_message_reset = CURRENT_DATE,
    updated_at = now()
  WHERE last_message_reset < CURRENT_DATE;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_send_message(user_uuid UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  user_subscription RECORD;
  can_send BOOLEAN := false;
BEGIN
  -- Get user subscription info
  SELECT 
    plan_type,
    message_limit_daily,
    messages_used_today,
    last_message_reset
  INTO user_subscription
  FROM public.subscribers
  WHERE user_id = user_uuid;
  
  -- If no subscription found, treat as free plan
  IF user_subscription IS NULL THEN
    INSERT INTO public.subscribers (user_id, plan_type, message_limit_daily, messages_used_today)
    VALUES (user_uuid, 'free', 3, 0);
    user_subscription.plan_type := 'free';
    user_subscription.message_limit_daily := 3;
    user_subscription.messages_used_today := 0;
    user_subscription.last_message_reset := CURRENT_DATE;
  END IF;
  
  -- Reset count if it's a new day
  IF user_subscription.last_message_reset < CURRENT_DATE THEN
    UPDATE public.subscribers 
    SET 
      messages_used_today = 0,
      last_message_reset = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = user_uuid;
    user_subscription.messages_used_today := 0;
  END IF;
  
  -- Check if user can send message
  IF user_subscription.plan_type = 'personal' THEN
    can_send := true; -- Unlimited for personal plan
  ELSE
    can_send := user_subscription.messages_used_today < user_subscription.message_limit_daily;
  END IF;
  
  -- Increment usage if they can send
  IF can_send THEN
    UPDATE public.subscribers 
    SET 
      messages_used_today = messages_used_today + 1,
      updated_at = now()
    WHERE user_id = user_uuid;
  END IF;
  
  RETURN can_send;
END;
$$;