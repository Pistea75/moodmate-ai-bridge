
-- Add email column to profiles table
ALTER TABLE public.profiles ADD COLUMN email TEXT;

-- Create a function to sync email from auth.users to profiles
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update existing profiles with emails from auth.users
  UPDATE public.profiles 
  SET email = auth_users.email
  FROM auth.users auth_users
  WHERE profiles.id = auth_users.id
  AND profiles.email IS NULL;
END;
$$;

-- Run the sync function to populate existing profiles
SELECT sync_user_email();

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
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
$$;

-- Create trigger to update email when it changes in auth.users
CREATE OR REPLACE FUNCTION sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update profile email when auth user email changes
  UPDATE public.profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for email updates
DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email IS DISTINCT FROM NEW.email)
  EXECUTE FUNCTION sync_profile_email();
