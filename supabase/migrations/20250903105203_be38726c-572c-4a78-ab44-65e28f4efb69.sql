-- Create session_inquiries table for marketplace booking requests
CREATE TABLE public.session_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  psychologist_id UUID NOT NULL,
  patient_message TEXT NOT NULL,
  patient_first_name TEXT NOT NULL,
  patient_last_name TEXT NOT NULL,
  session_topic TEXT NOT NULL,
  preferred_date TIMESTAMP WITH TIME ZONE,
  preferred_time_slot TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined, completed
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  clinician_response TEXT,
  session_id UUID -- Links to actual session when accepted
);

-- Enable Row Level Security
ALTER TABLE public.session_inquiries ENABLE ROW LEVEL SECURITY;

-- Patients can create inquiries
CREATE POLICY "Patients can create session inquiries" 
ON public.session_inquiries 
FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- Patients can view their own inquiries
CREATE POLICY "Patients can view their own inquiries" 
ON public.session_inquiries 
FOR SELECT 
USING (auth.uid() = patient_id);

-- Psychologists can view inquiries directed to them
CREATE POLICY "Psychologists can view their inquiries" 
ON public.session_inquiries 
FOR SELECT 
USING (auth.uid() = psychologist_id);

-- Psychologists can update inquiries (accept/decline)
CREATE POLICY "Psychologists can update their inquiries" 
ON public.session_inquiries 
FOR UPDATE 
USING (auth.uid() = psychologist_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_session_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_session_inquiries_updated_at
    BEFORE UPDATE ON public.session_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION public.update_session_inquiries_updated_at();