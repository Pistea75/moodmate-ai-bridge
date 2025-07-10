-- Create patient_risk_assessments table
CREATE TABLE public.patient_risk_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  clinician_id UUID NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  ai_assessment TEXT,
  data_points JSONB,
  assessed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_risk_assessments ENABLE ROW LEVEL SECURITY;

-- Create policies for patient risk assessments
CREATE POLICY "Clinicians can view their patients' risk assessments"
  ON public.patient_risk_assessments
  FOR SELECT
  USING (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can create risk assessments for their patients"
  ON public.patient_risk_assessments
  FOR INSERT
  WITH CHECK (auth.uid() = clinician_id);

CREATE POLICY "Clinicians can update their patients' risk assessments"
  ON public.patient_risk_assessments
  FOR UPDATE
  USING (auth.uid() = clinician_id)
  WITH CHECK (auth.uid() = clinician_id);

-- Create index for better performance
CREATE INDEX idx_patient_risk_assessments_patient_clinician 
  ON public.patient_risk_assessments(patient_id, clinician_id);

CREATE INDEX idx_patient_risk_assessments_risk_level 
  ON public.patient_risk_assessments(risk_level);

-- Add patient status enum and fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'at_risk', 'pending')),
ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;