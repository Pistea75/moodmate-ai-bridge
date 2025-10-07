-- Fix registration_tokens table token generation
-- The base64url encoding is not available, use hex encoding instead

ALTER TABLE registration_tokens 
  ALTER COLUMN token SET DEFAULT encode(gen_random_bytes(32), 'hex');