-- Create registration tokens table for approved users
CREATE TABLE public.registration_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  waiting_list_id UUID NOT NULL REFERENCES public.waiting_list(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'base64url'),
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_type TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registration_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Registration tokens can be validated by anyone" 
ON public.registration_tokens 
FOR SELECT 
USING (expires_at > now() AND used_at IS NULL);

CREATE POLICY "Service role can manage registration tokens" 
ON public.registration_tokens 
FOR ALL 
USING (auth.role() = 'service_role');

-- Create update trigger
CREATE TRIGGER update_registration_tokens_updated_at
BEFORE UPDATE ON public.registration_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_modified_column();