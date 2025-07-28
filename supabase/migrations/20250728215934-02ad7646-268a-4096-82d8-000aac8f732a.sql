
-- Super Admin RBAC Implementation with PHI Protection

-- 1. First, remove any existing super admin accounts and reset the system
UPDATE profiles SET is_super_admin = false WHERE is_super_admin = true;

-- 2. Create a proper role enumeration for better type safety
CREATE TYPE public.user_role AS ENUM ('patient', 'clinician', 'admin', 'super_admin');

-- 3. Add the new role column and migrate existing data
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS user_role public.user_role;

-- Migrate existing role data to the new enum column
UPDATE profiles SET user_role = role::public.user_role WHERE user_role IS NULL;

-- 4. Create PHI access logging table for compliance
CREATE TABLE IF NOT EXISTS public.phi_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  accessed_table TEXT NOT NULL,
  access_reason TEXT NOT NULL, -- 'legal_compliance', 'user_request', 'escalated_support', 'system_debug'
  justification TEXT NOT NULL,
  ip_address INET,
  user_agent TEXT,
  environment TEXT DEFAULT 'production', -- 'development', 'staging', 'production'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE -- for temporary access grants
);

-- Enable RLS on PHI access logs
ALTER TABLE public.phi_access_logs ENABLE ROW LEVEL SECURITY;

-- 5. Create admin role management table
CREATE TABLE IF NOT EXISTS public.admin_role_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_role public.user_role NOT NULL,
  assigned_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  assignment_reason TEXT,
  UNIQUE(user_id, assigned_role)
);

-- Enable RLS on admin role assignments
ALTER TABLE public.admin_role_assignments ENABLE ROW LEVEL SECURITY;

-- 6. Create PHI access permissions table for granular control
CREATE TABLE IF NOT EXISTS public.phi_access_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL,
  patient_id UUID NOT NULL,
  access_type TEXT NOT NULL, -- 'read_chat_logs', 'read_session_notes', 'read_mood_entries', etc.
  granted_by UUID REFERENCES profiles(id),
  reason TEXT NOT NULL,
  justification TEXT NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  environment TEXT DEFAULT 'production'
);

-- Enable RLS on PHI access permissions
ALTER TABLE public.phi_access_permissions ENABLE ROW LEVEL SECURITY;

-- 7. Create security definer function to check admin permissions (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.check_admin_phi_access(
  _admin_id UUID,
  _patient_id UUID,
  _access_type TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
DECLARE
  _has_permission BOOLEAN := false;
  _is_development BOOLEAN := false;
BEGIN
  -- Check if we're in development/staging environment
  _is_development := current_setting('app.environment', true) IN ('development', 'staging');
  
  -- In development/staging, allow broader access for debugging
  IF _is_development THEN
    SELECT EXISTS(
      SELECT 1 FROM profiles 
      WHERE id = _admin_id AND (user_role = 'super_admin' OR is_super_admin = true)
    ) INTO _has_permission;
    
    IF _has_permission THEN
      RETURN true;
    END IF;
  END IF;
  
  -- In production, check specific permissions
  SELECT EXISTS(
    SELECT 1 FROM phi_access_permissions 
    WHERE admin_id = _admin_id 
      AND patient_id = _patient_id 
      AND access_type = _access_type
      AND is_active = true
      AND expires_at > now()
  ) INTO _has_permission;
  
  RETURN _has_permission;
END;
$$;

-- 8. Create function to log PHI access
CREATE OR REPLACE FUNCTION public.log_phi_access(
  _admin_id UUID,
  _patient_id UUID,
  _table_name TEXT,
  _reason TEXT,
  _justification TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public', 'pg_temp'
AS $$
BEGIN
  INSERT INTO phi_access_logs (
    admin_id, patient_id, accessed_table, access_reason, justification,
    ip_address, user_agent, environment
  ) VALUES (
    _admin_id, _patient_id, _table_name, _reason, _justification,
    inet_client_addr(), current_setting('request.headers', true)::json->>'user-agent',
    current_setting('app.environment', true)
  );
END;
$$;

-- 9. Update RLS policies for PHI-containing tables with super admin access controls

-- Chat logs with PHI protection
DROP POLICY IF EXISTS "Super admin conditional PHI access" ON public.ai_chat_logs;
CREATE POLICY "Super admin conditional PHI access" ON public.ai_chat_logs
FOR SELECT 
USING (
  (auth.uid() = patient_id) OR
  (EXISTS (
    SELECT 1 FROM patient_clinician_links pcl
    WHERE pcl.patient_id = ai_chat_logs.patient_id AND pcl.clinician_id = auth.uid()
  )) OR
  (check_admin_phi_access(auth.uid(), patient_id, 'read_chat_logs'))
);

-- Session notes with PHI protection
DROP POLICY IF EXISTS "Super admin conditional session access" ON public.sessions;
CREATE POLICY "Super admin conditional session access" ON public.sessions
FOR SELECT 
USING (
  (clinician_id = auth.uid()) OR
  (patient_id = auth.uid()) OR
  (check_admin_phi_access(auth.uid(), patient_id, 'read_session_notes'))
);

-- Mood entries with PHI protection
DROP POLICY IF EXISTS "Super admin conditional mood access" ON public.mood_entries;
CREATE POLICY "Super admin conditional mood access" ON public.mood_entries
FOR SELECT 
USING (
  (auth.uid() = patient_id) OR
  (EXISTS (
    SELECT 1 FROM patient_clinician_links pcl
    WHERE pcl.patient_id = mood_entries.patient_id AND pcl.clinician_id = auth.uid()
  )) OR
  (check_admin_phi_access(auth.uid(), patient_id, 'read_mood_entries'))
);

-- 10. Admin management policies (non-PHI data)
CREATE POLICY "Super admins can view all profiles for management" ON public.profiles
FOR SELECT 
USING (
  (id = auth.uid()) OR
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (user_role = 'super_admin' OR is_super_admin = true)
  ))
);

CREATE POLICY "Super admins can update user profiles for management" ON public.profiles
FOR UPDATE 
USING (
  (id = auth.uid()) OR
  (EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (user_role = 'super_admin' OR is_super_admin = true)
  ))
);

-- 11. Audit log access policies
CREATE POLICY "Super admins can view audit logs" ON public.phi_access_logs
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (user_role = 'super_admin' OR is_super_admin = true)
  )
);

CREATE POLICY "Super admins can manage role assignments" ON public.admin_role_assignments
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (user_role = 'super_admin' OR is_super_admin = true)
  )
);

CREATE POLICY "Super admins can manage PHI permissions" ON public.phi_access_permissions
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND (user_role = 'super_admin' OR is_super_admin = true)
  )
);

-- 12. Create your super admin account (replace with your actual user ID)
-- You'll need to run this manually with your actual user ID after signup
-- UPDATE profiles SET user_role = 'super_admin', is_super_admin = true WHERE email = 'your-email@example.com';
