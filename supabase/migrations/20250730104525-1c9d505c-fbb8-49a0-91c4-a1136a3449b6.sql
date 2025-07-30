-- Enable leaked password protection
-- This setting helps prevent users from using known compromised passwords
UPDATE auth.config 
SET password_requirements = jsonb_set(
  COALESCE(password_requirements, '{}'::jsonb),
  '{check_password_leaked}',
  'true'::jsonb
);