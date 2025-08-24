-- Enhanced subscribers table for the new plans
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS message_limit_daily INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS messages_used_today INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_message_reset DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS patient_limit INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS patients_active INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS patients_sporadic INTEGER DEFAULT 0;

-- Create psychologist profiles table for marketplace
CREATE TABLE IF NOT EXISTS public.psychologist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  specializations TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  country TEXT,
  region TEXT,
  bio TEXT,
  experience_years INTEGER,
  is_accepting_patients BOOLEAN DEFAULT true,
  is_visible_marketplace BOOLEAN DEFAULT false,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create psychologist points system
CREATE TABLE IF NOT EXISTS public.psychologist_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  psychologist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  points_from_sessions INTEGER DEFAULT 0,
  points_from_workshops INTEGER DEFAULT 0,
  points_redeemed INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(psychologist_id)
);

-- Create session ratings table
CREATE TABLE IF NOT EXISTS public.session_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.sessions(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  psychologist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(session_id, patient_id)
);

-- Create workshops table
CREATE TABLE IF NOT EXISTS public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_psychologist_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 50,
  current_participants INTEGER DEFAULT 0,
  video_url TEXT,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
  points_reward INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create workshop participants table
CREATE TABLE IF NOT EXISTS public.workshop_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  attended BOOLEAN DEFAULT false,
  UNIQUE(workshop_id, participant_id)
);

-- Enable Row Level Security
ALTER TABLE public.psychologist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychologist_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workshop_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for psychologist_profiles
CREATE POLICY "Psychologists can manage their own profile" ON public.psychologist_profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anyone can view visible marketplace profiles" ON public.psychologist_profiles
  FOR SELECT USING (is_visible_marketplace = true);

-- RLS Policies for psychologist_points
CREATE POLICY "Psychologists can view their own points" ON public.psychologist_points
  FOR SELECT USING (auth.uid() = psychologist_id);

CREATE POLICY "Service role can manage points" ON public.psychologist_points
  FOR ALL USING (true);

-- RLS Policies for session_ratings
CREATE POLICY "Patients can create ratings for their sessions" ON public.session_ratings
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can view ratings for their sessions" ON public.session_ratings
  FOR SELECT USING (auth.uid() = patient_id OR auth.uid() = psychologist_id);

CREATE POLICY "Service role can manage ratings" ON public.session_ratings
  FOR ALL USING (true);

-- RLS Policies for workshops
CREATE POLICY "Psychologists can manage their workshops" ON public.workshops
  FOR ALL USING (auth.uid() = host_psychologist_id) WITH CHECK (auth.uid() = host_psychologist_id);

CREATE POLICY "Anyone can view scheduled workshops" ON public.workshops
  FOR SELECT USING (status IN ('scheduled', 'live'));

-- RLS Policies for workshop_participants
CREATE POLICY "Users can manage their workshop participation" ON public.workshop_participants
  FOR ALL USING (auth.uid() = participant_id) WITH CHECK (auth.uid() = participant_id);

CREATE POLICY "Workshop hosts can view participants" ON public.workshop_participants
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.workshops 
    WHERE workshops.id = workshop_participants.workshop_id 
    AND workshops.host_psychologist_id = auth.uid()
  ));

-- Create functions for points management
CREATE OR REPLACE FUNCTION public.award_session_points()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for session points
CREATE TRIGGER award_session_points_trigger
  BEFORE INSERT ON public.session_ratings
  FOR EACH ROW EXECUTE FUNCTION public.award_session_points();

-- Create function to reset daily message counts
CREATE OR REPLACE FUNCTION public.reset_daily_message_counts()
RETURNS void AS $$
BEGIN
  UPDATE public.subscribers 
  SET 
    messages_used_today = 0,
    last_message_reset = CURRENT_DATE,
    updated_at = now()
  WHERE last_message_reset < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check and increment message usage
CREATE OR REPLACE FUNCTION public.can_send_message(user_uuid UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;