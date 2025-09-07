-- Fix security linter warnings by adding proper search paths

-- Update generate_invitation_code function
CREATE OR REPLACE FUNCTION public.generate_invitation_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update normalize_phone_e164 function
CREATE OR REPLACE FUNCTION public.normalize_phone_e164(phone_input TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
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

-- Update update_invited_patients_updated_at function
CREATE OR REPLACE FUNCTION public.update_invited_patients_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;