-- Add professional subscription for Matías Beathyate
-- First, let's find the user ID for Matías Beathyate
DO $$
DECLARE
    user_uuid uuid;
    user_email text;
BEGIN
    -- Look for Matías Beathyate in profiles
    SELECT id, email INTO user_uuid, user_email 
    FROM profiles 
    WHERE (first_name ILIKE '%Matías%' OR first_name ILIKE '%Matias%') 
      AND (last_name ILIKE '%Beathyate%' OR last_name ILIKE '%Beathy%');
    
    IF user_uuid IS NOT NULL THEN
        -- Update or insert subscription record
        INSERT INTO subscribers (
            user_id,
            email,
            subscribed,
            subscription_tier,
            plan_type,
            subscription_end,
            message_limit_daily,
            patient_limit,
            updated_at
        ) VALUES (
            user_uuid,
            COALESCE(user_email, 'matias@example.com'),
            true,
            'Professional',
            'professional',
            NOW() + INTERVAL '1 year', -- Set for 1 year from now
            999999, -- Unlimited messages
            100, -- High patient limit for professional plan
            NOW()
        )
        ON CONFLICT (user_id) 
        DO UPDATE SET
            subscribed = true,
            subscription_tier = 'Professional',
            plan_type = 'professional',
            subscription_end = NOW() + INTERVAL '1 year',
            message_limit_daily = 999999,
            patient_limit = 100,
            updated_at = NOW();
            
        RAISE NOTICE 'Professional subscription added for user ID: %', user_uuid;
    ELSE
        RAISE NOTICE 'User Matías Beathyate not found in profiles table';
    END IF;
END $$;