-- Add professional subscription for Matías Beathyate
-- First, let's find the user ID for Matías Beathyate
DO $$
DECLARE
    user_uuid uuid;
    user_email text;
    existing_subscriber_id uuid;
BEGIN
    -- Look for Matías Beathyate in profiles
    SELECT id, email INTO user_uuid, user_email 
    FROM profiles 
    WHERE (first_name ILIKE '%Matías%' OR first_name ILIKE '%Matias%') 
      AND (last_name ILIKE '%Beathyate%' OR last_name ILIKE '%Beathy%');
    
    IF user_uuid IS NOT NULL THEN
        -- Check if subscriber record already exists
        SELECT id INTO existing_subscriber_id 
        FROM subscribers 
        WHERE user_id = user_uuid;
        
        IF existing_subscriber_id IS NOT NULL THEN
            -- Update existing subscription
            UPDATE subscribers SET
                subscribed = true,
                subscription_tier = 'Professional',
                plan_type = 'professional',
                subscription_end = NOW() + INTERVAL '1 year',
                message_limit_daily = 999999,
                patient_limit = 100,
                updated_at = NOW()
            WHERE user_id = user_uuid;
            
            RAISE NOTICE 'Updated professional subscription for user ID: %', user_uuid;
        ELSE
            -- Insert new subscription record
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
                NOW() + INTERVAL '1 year',
                999999,
                100,
                NOW()
            );
            
            RAISE NOTICE 'Created professional subscription for user ID: %', user_uuid;
        END IF;
    ELSE
        RAISE NOTICE 'User Matías Beathyate not found in profiles table. Please check the name spelling.';
    END IF;
END $$;