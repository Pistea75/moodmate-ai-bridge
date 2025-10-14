-- Create table for patient link requests
CREATE TABLE IF NOT EXISTS patient_link_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  clinician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(patient_id, clinician_id, status)
);

-- Enable RLS
ALTER TABLE patient_link_requests ENABLE ROW LEVEL SECURITY;

-- Patients can create their own requests
CREATE POLICY "Patients can create link requests"
ON patient_link_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = patient_id);

-- Patients can view their own requests
CREATE POLICY "Patients can view their requests"
ON patient_link_requests
FOR SELECT
TO authenticated
USING (auth.uid() = patient_id);

-- Clinicians can view requests for them
CREATE POLICY "Clinicians can view their requests"
ON patient_link_requests
FOR SELECT
TO authenticated
USING (auth.uid() = clinician_id);

-- Clinicians can update requests for them
CREATE POLICY "Clinicians can update their requests"
ON patient_link_requests
FOR UPDATE
TO authenticated
USING (auth.uid() = clinician_id)
WITH CHECK (auth.uid() = clinician_id);

-- Create index for faster queries
CREATE INDEX idx_patient_link_requests_clinician_status 
ON patient_link_requests(clinician_id, status);

CREATE INDEX idx_patient_link_requests_patient_status 
ON patient_link_requests(patient_id, status);