-- Add voice minutes tracking to subscribers table
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS voice_minutes_monthly_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS voice_minutes_used_this_month NUMERIC(10, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS voice_minutes_reset_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS share_chat_with_clinician BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS anonymize_conversations BOOLEAN DEFAULT true;

-- Create voice usage logs table for detailed tracking
CREATE TABLE IF NOT EXISTS public.voice_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_end TIMESTAMP WITH TIME ZONE,
  duration_seconds NUMERIC(10, 2) DEFAULT 0,
  duration_minutes NUMERIC(10, 2) GENERATED ALWAYS AS (duration_seconds / 60) STORED,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.voice_usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for voice_usage_logs
CREATE POLICY "Users can view their own voice usage logs"
  ON public.voice_usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own voice usage logs"
  ON public.voice_usage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create privacy consent logs table
CREATE TABLE IF NOT EXISTS public.privacy_consent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

ALTER TABLE public.privacy_consent_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for privacy_consent_logs
CREATE POLICY "Users can view their own consent logs"
  ON public.privacy_consent_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert consent logs"
  ON public.privacy_consent_logs
  FOR INSERT
  WITH CHECK (true);

-- Function to check if user can use voice mode
CREATE OR REPLACE FUNCTION public.can_use_voice_mode(user_uuid UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  user_subscription RECORD;
  can_use BOOLEAN := false;
  minutes_remaining NUMERIC := 0;
  reason TEXT := '';
BEGIN
  -- Get user subscription info
  SELECT 
    plan_type,
    voice_minutes_monthly_limit,
    voice_minutes_used_this_month,
    voice_minutes_reset_date
  INTO user_subscription
  FROM public.subscribers
  WHERE user_id = user_uuid;
  
  -- If no subscription found, treat as free plan (no voice)
  IF user_subscription IS NULL THEN
    RETURN jsonb_build_object(
      'can_use', false,
      'minutes_remaining', 0,
      'minutes_limit', 0,
      'reason', 'No subscription found. Voice mode requires premium plan.'
    );
  END IF;
  
  -- Reset monthly counter if needed
  IF user_subscription.voice_minutes_reset_date < CURRENT_DATE THEN
    UPDATE public.subscribers 
    SET 
      voice_minutes_used_this_month = 0,
      voice_minutes_reset_date = CURRENT_DATE,
      updated_at = now()
    WHERE user_id = user_uuid;
    user_subscription.voice_minutes_used_this_month := 0;
  END IF;
  
  -- Check voice availability based on plan
  IF user_subscription.plan_type IN ('free', 'personal') THEN
    can_use := false;
    reason := 'Voice mode requires Premium plan. You can record voice messages for transcription.';
  ELSIF user_subscription.voice_minutes_monthly_limit = -1 THEN
    -- Unlimited voice (for psychologists)
    can_use := true;
    minutes_remaining := -1; -- -1 indicates unlimited
  ELSIF user_subscription.voice_minutes_used_this_month >= user_subscription.voice_minutes_monthly_limit THEN
    can_use := false;
    minutes_remaining := 0;
    reason := 'Voice minute limit reached. Upgrade or purchase additional minutes.';
  ELSE
    can_use := true;
    minutes_remaining := user_subscription.voice_minutes_monthly_limit - user_subscription.voice_minutes_used_this_month;
  END IF;
  
  RETURN jsonb_build_object(
    'can_use', can_use,
    'minutes_remaining', minutes_remaining,
    'minutes_limit', user_subscription.voice_minutes_monthly_limit,
    'minutes_used', user_subscription.voice_minutes_used_this_month,
    'reason', reason,
    'plan_type', user_subscription.plan_type
  );
END;
$$;

-- Function to track voice usage
CREATE OR REPLACE FUNCTION public.track_voice_usage(
  user_uuid UUID,
  duration_seconds NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  duration_minutes NUMERIC;
BEGIN
  duration_minutes := duration_seconds / 60.0;
  
  -- Update subscribers table
  UPDATE public.subscribers
  SET 
    voice_minutes_used_this_month = voice_minutes_used_this_month + duration_minutes,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN true;
END;
$$;

-- Update subscription plan defaults
UPDATE public.subscribers
SET 
  voice_minutes_monthly_limit = CASE
    WHEN plan_type IN ('free', 'personal') THEN 0
    WHEN plan_type = 'premium' THEN 60
    WHEN plan_type IN ('professional_basic', 'professional_advanced') THEN -1 -- unlimited for psychologists
    ELSE 0
  END,
  voice_minutes_reset_date = CURRENT_DATE
WHERE voice_minutes_monthly_limit IS NULL;