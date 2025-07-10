-- Add missing columns to profiles table for patient onboarding
ALTER TABLE public.profiles 
ADD COLUMN phone TEXT,
ADD COLUMN emergency_contact_name TEXT,
ADD COLUMN emergency_contact_phone TEXT,
ADD COLUMN initial_assessment TEXT,
ADD COLUMN treatment_goals TEXT,
ADD COLUMN welcome_message TEXT;