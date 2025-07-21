-- Create super admin role and user management
CREATE TYPE public.user_role AS ENUM ('patient', 'clinician', 'admin', 'super_admin');

-- Add super_admin role to existing role column if needed
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Create admin logs table for tracking actions
CREATE TABLE public.admin_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID NOT NULL,
  action TEXT NOT NULL,
  target_user_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for super admin access
CREATE POLICY "Super admins can manage admin logs" 
ON public.admin_logs 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_super_admin = TRUE
));

-- Create system settings table
CREATE TABLE public.system_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for super admin access to system settings
CREATE POLICY "Super admins can manage system settings" 
ON public.system_settings 
FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_super_admin = TRUE
));

-- Insert default admin user (use your email)
INSERT INTO public.profiles (
  id,
  email,
  first_name,
  last_name,
  role,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'admin@moodmate.com',
  'Super',
  'Admin',
  'patient', -- Keep as patient for now since we can't change auth directly
  TRUE,
  now(),
  now()
) ON CONFLICT (id) DO UPDATE SET
  is_super_admin = TRUE,
  email = 'admin@moodmate.com';

-- Insert default system settings
INSERT INTO public.system_settings (setting_key, setting_value, description) VALUES
('maintenance_mode', '{"enabled": false, "message": "System is under maintenance"}', 'Controls maintenance mode'),
('user_registration', '{"enabled": true, "require_approval": false}', 'Controls user registration settings'),
('ai_features', '{"enabled": true, "model": "gpt-4", "rate_limit": 100}', 'AI system configuration'),
('notifications', '{"email_enabled": true, "sms_enabled": false}', 'Notification system settings')
ON CONFLICT (setting_key) DO NOTHING;