
-- Phase 1: Critical Database Security Fixes

-- 1. Fix all SECURITY DEFINER functions to prevent search path manipulation attacks
ALTER FUNCTION public.handle_new_user() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.sync_profile_email() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.sync_user_email() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.link_patient_to_clinician() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.create_session_notifications() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.create_mood_alert_notification() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.check_upcoming_sessions() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.create_task_completion_notification() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.validate_role_update() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.get_current_user_role() SET search_path = 'public', 'pg_temp';
ALTER FUNCTION public.cleanup_session_recording() SET search_path = 'public', 'pg_temp';

-- 2. Fix overly permissive RLS policies - replace "true" policies with proper restrictions

-- Fix rate_limit_attempts policy to be more restrictive
DROP POLICY IF EXISTS "System can manage rate limit attempts" ON public.rate_limit_attempts;
CREATE POLICY "Service role can manage rate limit attempts" ON public.rate_limit_attempts
FOR ALL 
TO service_role
USING (true);

-- Fix brodi_nudge_history policy to be more restrictive for system operations
DROP POLICY IF EXISTS "System can manage nudge history" ON public.brodi_nudge_history;
CREATE POLICY "Service role can manage nudge history" ON public.brodi_nudge_history
FOR ALL 
TO service_role
USING (true);

-- Fix brodi_pattern_analysis policy to be more restrictive for system operations
DROP POLICY IF EXISTS "System can manage pattern analysis" ON public.brodi_pattern_analysis;
CREATE POLICY "Service role can manage pattern analysis" ON public.brodi_pattern_analysis
FOR ALL 
TO service_role
USING (true);

-- Fix security audit logs and enhanced security logs policies
DROP POLICY IF EXISTS "System can insert security audit logs" ON public.security_audit_logs;
DROP POLICY IF EXISTS "System can insert enhanced security logs" ON public.enhanced_security_logs;

CREATE POLICY "Service role can insert security audit logs" ON public.security_audit_logs
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Service role can insert enhanced security logs" ON public.enhanced_security_logs
FOR INSERT 
TO service_role
WITH CHECK (true);

-- Fix notifications policy to be more restrictive for system operations
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
CREATE POLICY "Service role can insert notifications" ON public.notifications
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 3. Add missing UPDATE/DELETE policies for user data protection

-- Add missing UPDATE policy for mood_entries
CREATE POLICY "Patients can update their own mood entries" ON public.mood_entries
FOR UPDATE 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

-- Add missing DELETE policy for mood_entries  
CREATE POLICY "Patients can delete their own mood entries" ON public.mood_entries
FOR DELETE 
USING (auth.uid() = patient_id);

-- Add missing DELETE policy for brodi_interactions
CREATE POLICY "Users can delete their own Brodi interactions" ON public.brodi_interactions
FOR DELETE 
USING (auth.uid() = user_id);

-- Add missing UPDATE/DELETE policies for ai_chat_logs
CREATE POLICY "Users can update their own chat logs" ON public.ai_chat_logs
FOR UPDATE 
USING (auth.uid() = patient_id)
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can delete their own chat logs" ON public.ai_chat_logs
FOR DELETE 
USING (auth.uid() = patient_id);

-- 4. Ensure proper audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS public.sensitive_operations_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  operation TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on the audit table
ALTER TABLE public.sensitive_operations_log ENABLE ROW LEVEL SECURITY;

-- Only super admins can view audit logs
CREATE POLICY "Super admins can view sensitive operations log" ON public.sensitive_operations_log
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND is_super_admin = true
));

-- Service role can insert audit logs
CREATE POLICY "Service role can insert sensitive operations log" ON public.sensitive_operations_log
FOR INSERT 
TO service_role
WITH CHECK (true);
