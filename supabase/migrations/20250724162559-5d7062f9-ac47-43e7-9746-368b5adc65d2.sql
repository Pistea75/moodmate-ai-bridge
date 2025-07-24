
-- Phase 1: Critical RBAC Security Fixes

-- 1. Create secure function to get user role (prevents recursive RLS)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- 2. Create secure function to check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public, pg_catalog
AS $$
  SELECT COALESCE(is_super_admin, false) FROM public.profiles WHERE id = user_id;
$$;

-- 3. Add RLS policy to prevent users from updating their own role
DROP POLICY IF EXISTS "Prevent role self-modification" ON public.profiles;
CREATE POLICY "Prevent role self-modification" 
ON public.profiles 
FOR UPDATE 
USING (
  CASE 
    WHEN OLD.role != NEW.role THEN public.is_super_admin()
    ELSE true
  END
);

-- 4. Add RLS policy to prevent users from making themselves super admin
DROP POLICY IF EXISTS "Prevent super admin self-promotion" ON public.profiles;
CREATE POLICY "Prevent super admin self-promotion" 
ON public.profiles 
FOR UPDATE 
USING (
  CASE 
    WHEN OLD.is_super_admin != NEW.is_super_admin THEN public.is_super_admin()
    ELSE true
  END
);

-- 5. Fix existing database functions to have proper search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $function$
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
$function$;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $function$
BEGIN
  UPDATE public.profiles 
  SET email = NEW.email, updated_at = NOW()
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$function$;

-- 6. Create audit log table for security monitoring
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  resource text NOT NULL,
  details jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  success boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view audit logs" 
ON public.security_audit_logs 
FOR SELECT 
USING (public.is_super_admin());

-- System can insert audit logs
CREATE POLICY "System can insert audit logs" 
ON public.security_audit_logs 
FOR INSERT 
WITH CHECK (true);

-- 7. Create function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _action text,
  _resource text,
  _details jsonb DEFAULT '{}',
  _success boolean DEFAULT true
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.security_audit_logs (
    user_id, action, resource, details, success
  ) VALUES (
    auth.uid(), _action, _resource, _details, _success
  );
END;
$$;

-- 8. Add trigger to log role changes
CREATE OR REPLACE FUNCTION public.audit_profile_changes()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  -- Log role changes
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    PERFORM public.log_security_event(
      'role_change',
      'profiles',
      jsonb_build_object(
        'user_id', NEW.id,
        'old_role', OLD.role,
        'new_role', NEW.role,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  -- Log super admin changes
  IF OLD.is_super_admin IS DISTINCT FROM NEW.is_super_admin THEN
    PERFORM public.log_security_event(
      'super_admin_change',
      'profiles',
      jsonb_build_object(
        'user_id', NEW.id,
        'old_value', OLD.is_super_admin,
        'new_value', NEW.is_super_admin,
        'changed_by', auth.uid()
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for profile audit
DROP TRIGGER IF EXISTS audit_profile_changes ON public.profiles;
CREATE TRIGGER audit_profile_changes
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_profile_changes();
