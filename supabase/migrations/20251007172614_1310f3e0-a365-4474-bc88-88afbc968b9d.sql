-- Add referral_code column to waiting_list table
ALTER TABLE public.waiting_list 
ADD COLUMN referral_code TEXT;

-- Add referral_code column to registration_tokens table
ALTER TABLE public.registration_tokens 
ADD COLUMN referral_code TEXT;

-- Add index for faster lookups
CREATE INDEX idx_profiles_referral_code ON public.profiles(referral_code);

-- Comment for documentation
COMMENT ON COLUMN public.waiting_list.referral_code IS 'Psychologist referral code for patient linking';
COMMENT ON COLUMN public.registration_tokens.referral_code IS 'Psychologist referral code to create patient-clinician link upon registration';