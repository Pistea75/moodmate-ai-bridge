-- Critical Security Fixes Migration
-- Phase 1: Address Role Escalation and Super Admin Security

-- 1. Create secure role management function to prevent unauthorized role changes
CREATE OR REPLACE FUNCTION public.secure_update_user_role(
  target_user_id UUID,
  new_role TEXT,
  new_super_admin BOOLEAN DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  current_user_role TEXT;
  current_user_super_admin BOOLEAN;
  target_user_current_role TEXT;
  target_user_current_super_admin BOOLEAN;
BEGIN
  -- Get current user's role and super admin status
  SELECT role, COALESCE(is_super_admin, false) 
  INTO current_user_role, current_user_super_admin
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Get target user's current role and super admin status
  SELECT role, COALESCE(is_super_admin, false)
  INTO target_user_current_role, target_user_current_super_admin
  FROM profiles
  WHERE id = target_user_id;
  
  -- Security checks
  -- 1. Users cannot change their own role unless they are super admin
  IF target_user_id = auth.uid() AND NOT current_user_super_admin THEN
    -- Log unauthorized attempt
    INSERT INTO security_audit_logs (
      user_id, action, resource, success, details
    ) VALUES (
      auth.uid(), 'role_change_attempt', 'profiles', false,
      jsonb_build_object(
        'reason', 'self_role_change_denied',
        'target_user_id', target_user_id,
        'attempted_role', new_role
      )
    );
    RETURN FALSE;
  END IF;
  
  -- 2. Only super admins can change roles
  IF NOT current_user_super_admin THEN
    INSERT INTO security_audit_logs (
      user_id, action, resource, success, details
    ) VALUES (
      auth.uid(), 'role_change_attempt', 'profiles', false,
      jsonb_build_object(
        'reason', 'insufficient_privileges',
        'target_user_id', target_user_id,
        'user_role', current_user_role
      )
    );
    RETURN FALSE;
  END IF;
  
  -- 3. Only super admins can grant super admin privileges
  IF new_super_admin = true AND NOT current_user_super_admin THEN
    INSERT INTO security_audit_logs (
      user_id, action, resource, success, details
    ) VALUES (
      auth.uid(), 'super_admin_grant_attempt', 'profiles', false,
      jsonb_build_object(
        'reason', 'insufficient_privileges_for_super_admin',
        'target_user_id', target_user_id
      )
    );
    RETURN FALSE;
  END IF;
  
  -- Perform the update
  UPDATE profiles 
  SET 
    role = new_role,
    is_super_admin = COALESCE(new_super_admin, is_super_admin),
    updated_at = NOW()
  WHERE id = target_user_id;
  
  -- Log successful role change
  INSERT INTO security_audit_logs (
    user_id, action, resource, success, details
  ) VALUES (
    auth.uid(), 'role_changed', 'profiles', true,
    jsonb_build_object(
      'target_user_id', target_user_id,
      'old_role', target_user_current_role,
      'new_role', new_role,
      'old_super_admin', target_user_current_super_admin,
      'new_super_admin', COALESCE(new_super_admin, target_user_current_super_admin)
    )
  );
  
  -- Log to sensitive operations
  INSERT INTO sensitive_operations_log (
    user_id, operation, table_name, record_id,
    old_values, new_values
  ) VALUES (
    auth.uid(), 'UPDATE', 'profiles', target_user_id,
    jsonb_build_object(
      'role', target_user_current_role,
      'is_super_admin', target_user_current_super_admin
    ),
    jsonb_build_object(
      'role', new_role,
      'is_super_admin', COALESCE(new_super_admin, target_user_current_super_admin)
    )
  );
  
  RETURN TRUE;
END;
$$;

-- 2. Create trigger to prevent direct role updates bypassing the secure function
CREATE OR REPLACE FUNCTION public.validate_role_update_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  current_user_super_admin BOOLEAN;
BEGIN
  -- Allow system operations (like initial user creation)
  IF session_user = 'postgres' OR session_user = 'supabase_admin' THEN
    RETURN NEW;
  END IF;
  
  -- Check if role or super admin status is being changed
  IF OLD.role != NEW.role OR OLD.is_super_admin != NEW.is_super_admin THEN
    -- Get current user's super admin status
    SELECT COALESCE(is_super_admin, false) 
    INTO current_user_super_admin
    FROM profiles 
    WHERE id = auth.uid();
    
    -- Prevent users from updating their own role unless they're super admin
    IF NEW.id = auth.uid() AND NOT current_user_super_admin THEN
      -- Log the attempt
      INSERT INTO security_audit_logs (
        user_id, action, resource, success, details
      ) VALUES (
        auth.uid(), 'direct_role_update_blocked', 'profiles', false,
        jsonb_build_object(
          'reason', 'direct_update_not_allowed',
          'old_role', OLD.role,
          'attempted_role', NEW.role,
          'old_super_admin', OLD.is_super_admin,
          'attempted_super_admin', NEW.is_super_admin
        )
      );
      
      RAISE EXCEPTION 'Direct role updates are not allowed. Use secure_update_user_role function.';
    END IF;
    
    -- Only super admins can change roles
    IF NOT current_user_super_admin THEN
      INSERT INTO security_audit_logs (
        user_id, action, resource, success, details
      ) VALUES (
        auth.uid(), 'direct_role_update_blocked', 'profiles', false,
        jsonb_build_object(
          'reason', 'insufficient_privileges',
          'target_user_id', NEW.id,
          'user_role', (SELECT role FROM profiles WHERE id = auth.uid())
        )
      );
      
      RAISE EXCEPTION 'Only super administrators can change user roles.';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS validate_role_update ON profiles;
CREATE TRIGGER validate_role_update
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION validate_role_update_trigger();

-- 3. Create function to securely check super admin privileges with logging
CREATE OR REPLACE FUNCTION public.verify_super_admin_access(
  action_description TEXT DEFAULT 'super_admin_action'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  is_super_admin_user BOOLEAN;
BEGIN
  -- Check if current user is super admin
  SELECT COALESCE(is_super_admin, false) 
  INTO is_super_admin_user
  FROM profiles 
  WHERE id = auth.uid();
  
  -- Log the access attempt
  INSERT INTO security_audit_logs (
    user_id, action, resource, success, details
  ) VALUES (
    auth.uid(), 'super_admin_access_check', 'system', is_super_admin_user,
    jsonb_build_object(
      'action_description', action_description,
      'timestamp', NOW()
    )
  );
  
  RETURN is_super_admin_user;
END;
$$;

-- 4. Create function for emergency super admin access revocation
CREATE OR REPLACE FUNCTION public.emergency_revoke_super_admin(
  target_user_id UUID,
  reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  current_user_super_admin BOOLEAN;
  target_user_email TEXT;
BEGIN
  -- Verify current user is super admin
  SELECT COALESCE(is_super_admin, false) 
  INTO current_user_super_admin
  FROM profiles 
  WHERE id = auth.uid();
  
  IF NOT current_user_super_admin THEN
    RAISE EXCEPTION 'Only super administrators can revoke super admin access.';
  END IF;
  
  -- Get target user email for logging
  SELECT email INTO target_user_email
  FROM profiles
  WHERE id = target_user_id;
  
  -- Revoke super admin access
  UPDATE profiles 
  SET 
    is_super_admin = false,
    updated_at = NOW()
  WHERE id = target_user_id;
  
  -- Log the emergency revocation
  INSERT INTO security_audit_logs (
    user_id, action, resource, success, details
  ) VALUES (
    auth.uid(), 'emergency_super_admin_revocation', 'profiles', true,
    jsonb_build_object(
      'target_user_id', target_user_id,
      'target_user_email', target_user_email,
      'reason', reason,
      'timestamp', NOW()
    )
  );
  
  -- Log to sensitive operations
  INSERT INTO sensitive_operations_log (
    user_id, operation, table_name, record_id,
    old_values, new_values
  ) VALUES (
    auth.uid(), 'EMERGENCY_REVOKE', 'profiles', target_user_id,
    jsonb_build_object('is_super_admin', true),
    jsonb_build_object('is_super_admin', false, 'revocation_reason', reason)
  );
  
  RETURN TRUE;
END;
$$;

-- 5. Create enhanced input validation function for Edge Functions
CREATE OR REPLACE FUNCTION public.validate_edge_function_input(
  input_data JSONB,
  required_fields TEXT[],
  max_lengths JSONB DEFAULT '{}'::jsonb
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  field TEXT;
  field_value TEXT;
  max_length INTEGER;
BEGIN
  -- Check required fields
  FOREACH field IN ARRAY required_fields
  LOOP
    IF NOT (input_data ? field) OR input_data ->> field IS NULL OR input_data ->> field = '' THEN
      RAISE EXCEPTION 'Required field missing or empty: %', field;
    END IF;
  END LOOP;
  
  -- Check field lengths if specified
  FOR field IN SELECT jsonb_object_keys(max_lengths)
  LOOP
    IF input_data ? field THEN
      field_value := input_data ->> field;
      max_length := (max_lengths ->> field)::INTEGER;
      
      IF length(field_value) > max_length THEN
        RAISE EXCEPTION 'Field % exceeds maximum length of %', field, max_length;
      END IF;
    END IF;
  END LOOP;
  
  RETURN TRUE;
END;
$$;

-- 6. Update existing RLS policies to use new security functions
-- First, drop the existing problematic policy
DROP POLICY IF EXISTS "validate_role_update" ON profiles;

-- Create new enhanced RLS policy for role updates
CREATE POLICY "Enhanced role update validation" 
ON profiles 
FOR UPDATE 
USING (
  -- Allow users to update their own profile (non-sensitive fields)
  (auth.uid() = id AND 
   -- Ensure role and super admin fields are not being changed directly
   (SELECT role FROM profiles WHERE id = auth.uid()) = NEW.role AND
   (SELECT COALESCE(is_super_admin, false) FROM profiles WHERE id = auth.uid()) = NEW.is_super_admin)
  OR 
  -- Allow super admins to update any profile
  verify_super_admin_access('profile_update')
)
WITH CHECK (
  -- Same conditions for WITH CHECK
  (auth.uid() = id AND 
   (SELECT role FROM profiles WHERE id = auth.uid()) = NEW.role AND
   (SELECT COALESCE(is_super_admin, false) FROM profiles WHERE id = auth.uid()) = NEW.is_super_admin)
  OR 
  verify_super_admin_access('profile_update')
);

-- 7. Create rate limiting table for enhanced security
CREATE TABLE IF NOT EXISTS public.security_rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on security_rate_limits
ALTER TABLE public.security_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for security_rate_limits
CREATE POLICY "Service role can manage security rate limits" 
ON security_rate_limits 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_rate_limits_user_action 
ON security_rate_limits(user_id, action_type);

CREATE INDEX IF NOT EXISTS idx_security_rate_limits_window 
ON security_rate_limits(window_start, blocked_until);

-- 8. Create function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_security_rate_limit(
  p_user_id UUID,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 15,
  p_block_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  current_attempts INTEGER;
  window_start TIMESTAMP WITH TIME ZONE;
  blocked_until TIMESTAMP WITH TIME ZONE;
  is_blocked BOOLEAN := FALSE;
BEGIN
  -- Check if user is currently blocked
  SELECT security_rate_limits.blocked_until INTO blocked_until
  FROM security_rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND blocked_until > NOW()
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF blocked_until IS NOT NULL THEN
    -- Log blocked attempt
    INSERT INTO security_audit_logs (
      user_id, action, resource, success, details
    ) VALUES (
      p_user_id, 'rate_limit_blocked', p_action_type, false,
      jsonb_build_object(
        'blocked_until', blocked_until,
        'action_type', p_action_type
      )
    );
    RETURN FALSE;
  END IF;
  
  -- Check current window
  window_start := NOW() - INTERVAL '1 minute' * p_window_minutes;
  
  SELECT attempts INTO current_attempts
  FROM security_rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND window_start > window_start
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF current_attempts IS NULL THEN
    -- First attempt in window
    INSERT INTO security_rate_limits (user_id, action_type, attempts, window_start)
    VALUES (p_user_id, p_action_type, 1, NOW());
    RETURN TRUE;
  END IF;
  
  IF current_attempts >= p_max_attempts THEN
    -- Block user
    UPDATE security_rate_limits 
    SET blocked_until = NOW() + INTERVAL '1 minute' * p_block_minutes,
        updated_at = NOW()
    WHERE user_id = p_user_id 
      AND action_type = p_action_type 
      AND window_start > window_start;
    
    -- Log rate limit exceeded
    INSERT INTO security_audit_logs (
      user_id, action, resource, success, details
    ) VALUES (
      p_user_id, 'rate_limit_exceeded', p_action_type, false,
      jsonb_build_object(
        'attempts', current_attempts,
        'max_attempts', p_max_attempts,
        'blocked_for_minutes', p_block_minutes
      )
    );
    
    RETURN FALSE;
  ELSE
    -- Increment attempts
    UPDATE security_rate_limits 
    SET attempts = attempts + 1,
        updated_at = NOW()
    WHERE user_id = p_user_id 
      AND action_type = p_action_type 
      AND window_start > window_start;
    
    RETURN TRUE;
  END IF;
END;
$$;