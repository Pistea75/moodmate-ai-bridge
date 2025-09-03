-- Fix security warning by updating the function to set search_path
CREATE OR REPLACE FUNCTION public.update_session_inquiries_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;