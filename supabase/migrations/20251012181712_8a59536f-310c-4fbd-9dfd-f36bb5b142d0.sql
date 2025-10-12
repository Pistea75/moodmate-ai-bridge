-- Make anonymization mandatory by setting default to true and removing it from privacy settings UI
-- Update all existing users to have anonymization enabled
UPDATE subscribers 
SET anonymize_conversations = true
WHERE anonymize_conversations IS NULL OR anonymize_conversations = false;

-- Set default to true for future users
ALTER TABLE subscribers 
ALTER COLUMN anonymize_conversations SET DEFAULT true;

-- Add a comment explaining this is mandatory for security and research
COMMENT ON COLUMN subscribers.anonymize_conversations IS 'Always true - all chats are anonymized for security and AI model improvement';