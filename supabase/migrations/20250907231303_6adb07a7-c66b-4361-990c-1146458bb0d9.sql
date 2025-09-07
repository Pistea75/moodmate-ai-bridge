-- Create invited_patients table to store preliminary patient data
CREATE TABLE public.invited_patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  psychologist_id UUID NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_e164 TEXT NOT NULL,
  email TEXT,
  status TEXT NOT NULL DEFAULT 'invited' CHECK (status IN ('invited', 'registered')),
  user_id UUID, -- Will be populated when they register
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique phone per psychologist for non-registered patients
  UNIQUE(psychologist_id, phone_e164)
);

-- Create patient_invitations table to store invitation codes
CREATE TABLE public.patient_invitations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.invited_patients(id) ON DELETE CASCADE,
  psychologist_id UUID NOT NULL,
  code TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure invitation codes are unique
  CONSTRAINT unique_invitation_code UNIQUE(code)
);

-- Enable RLS on both tables
ALTER TABLE public.invited_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_invitations ENABLE ROW LEVEL SECURITY;

-- RLS policies for invited_patients
CREATE POLICY "Psychologists can manage their invited patients"
ON public.invited_patients
FOR ALL
USING (psychologist_id = auth.uid())
WITH CHECK (psychologist_id = auth.uid());

CREATE POLICY "Service role can access invited patients"
ON public.invited_patients
FOR ALL
USING (true);

-- RLS policies for patient_invitations  
CREATE POLICY "Psychologists can manage their invitations"
ON public.patient_invitations
FOR ALL
USING (psychologist_id = auth.uid())
WITH CHECK (psychologist_id = auth.uid());

CREATE POLICY "Anyone can read valid invitations by code"
ON public.patient_invitations
FOR SELECT
USING (expires_at > now() AND used_at IS NULL);

CREATE POLICY "Service role can manage invitations"
ON public.patient_invitations
FOR ALL
USING (true);

-- Function to generate invitation codes
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$;

-- Function to normalize phone to E.164 format (basic implementation)
CREATE OR REPLACE FUNCTION public.normalize_phone_e164(phone_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- Remove all non-digit characters except +
  phone_input := regexp_replace(phone_input, '[^+0-9]', '', 'g');
  
  -- If it doesn't start with +, assume it needs country code
  IF NOT phone_input LIKE '+%' THEN
    -- For this implementation, assume Argentina (+54) if no country code
    phone_input := '+54' || phone_input;
  END IF;
  
  RETURN phone_input;
END;
$$;

-- Update function for timestamps
CREATE OR REPLACE FUNCTION public.update_invited_patients_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for updating timestamps
CREATE TRIGGER update_invited_patients_updated_at
  BEFORE UPDATE ON public.invited_patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_invited_patients_updated_at();

-- Index for performance
CREATE INDEX idx_invited_patients_psychologist_id ON public.invited_patients(psychologist_id);
CREATE INDEX idx_invited_patients_phone ON public.invited_patients(phone_e164);
CREATE INDEX idx_patient_invitations_code ON public.patient_invitations(code);
CREATE INDEX idx_patient_invitations_expires_at ON public.patient_invitations(expires_at);