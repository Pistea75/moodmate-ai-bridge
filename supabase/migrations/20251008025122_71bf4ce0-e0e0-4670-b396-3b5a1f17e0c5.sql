-- Grant Andrés Fabini premium subscription with unlimited access
INSERT INTO public.subscribers (
  user_id, 
  email,
  subscribed, 
  subscription_tier, 
  subscription_end, 
  plan_type, 
  message_limit_daily,
  patient_limit,
  messages_used_today,
  last_message_reset,
  created_at,
  updated_at
) VALUES (
  'd6e92ffb-8a74-4a0d-b381-9bdf45185695',
  'holachicosdeytube@gmail.com',
  true,
  'Premium',
  (NOW() + INTERVAL '10 years'),
  'premium',
  999999,
  999999,
  0,
  CURRENT_DATE,
  NOW(),
  NOW()
);