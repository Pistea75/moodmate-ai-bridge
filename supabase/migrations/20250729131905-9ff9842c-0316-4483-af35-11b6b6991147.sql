
-- Create direct_messages table for clinician-patient communication
CREATE TABLE public.direct_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_read BOOLEAN NOT NULL DEFAULT false
);

-- Add Row Level Security
ALTER TABLE public.direct_messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages where they are sender or recipient
CREATE POLICY "Users can view their messages" 
  ON public.direct_messages 
  FOR SELECT 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Users can send messages
CREATE POLICY "Users can send messages" 
  ON public.direct_messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Users can update messages they sent (for read status, etc)
CREATE POLICY "Users can update their sent messages" 
  ON public.direct_messages 
  FOR UPDATE 
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Create function to automatically create notification when message is sent
CREATE OR REPLACE FUNCTION create_message_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
  sender_name TEXT;
BEGIN
  -- Get sender name
  SELECT CONCAT(first_name, ' ', last_name) INTO sender_name
  FROM profiles
  WHERE id = NEW.sender_id;
  
  -- Create notification for recipient
  INSERT INTO notifications (
    user_id, type, title, description, priority, metadata
  ) VALUES (
    NEW.recipient_id, 'message', 'New Message',
    'You have a new message from ' || COALESCE(sender_name, 'Someone'),
    'medium',
    jsonb_build_object(
      'message_id', NEW.id,
      'sender_id', NEW.sender_id,
      'sender_name', sender_name
    )
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for message notifications
CREATE TRIGGER on_message_sent
  AFTER INSERT ON direct_messages
  FOR EACH ROW EXECUTE FUNCTION create_message_notification();
