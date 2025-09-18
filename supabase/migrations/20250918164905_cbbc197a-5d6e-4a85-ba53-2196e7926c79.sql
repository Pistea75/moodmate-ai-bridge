-- Update system settings to use GPT-4o-mini as default model
UPDATE public.system_settings 
SET 
  setting_value = '{"enabled": true, "model": "gpt-4o-mini", "rate_limit": 100}',
  updated_at = NOW()
WHERE setting_key = 'ai_features';

-- Insert if not exists (fallback)
INSERT INTO public.system_settings (setting_key, setting_value, description, created_at, updated_at) 
VALUES (
  'ai_features', 
  '{"enabled": true, "model": "gpt-4o-mini", "rate_limit": 100}',
  'AI system configuration with GPT-4o-mini as default model',
  NOW(),
  NOW()
)
ON CONFLICT (setting_key) DO UPDATE SET
  setting_value = EXCLUDED.setting_value,
  updated_at = NOW();