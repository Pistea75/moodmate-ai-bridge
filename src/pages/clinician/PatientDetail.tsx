import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import ClinicianLayout from '@/layouts/ClinicianLayout';
import { PatientMoodSection } from '@/components/clinician/PatientMoodSection';
import { PatientTasksSection } from '@/components/clinician/PatientTasksSection';
import { PatientDetailSkeleton } from '@/components/clinician/PatientDetailSkeleton';
import { PatientDetailError } from '@/components/clinician/PatientDetailError';
import { PatientMoodTimeBreakdown } from '@/components/clinician/PatientMoodTimeBreakdown';
import { PatientTriggerBreakdown } from '@/components/clinician/PatientTriggerBreakdown';
import { PatientMoodHistory } from '@/components/clinician/PatientMoodHistory';
import { MoodReportPDF } from '@/components/clinician/MoodReportPDF';

interface PatientProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  language: string;
}

export default function PatientDetail() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        
        if (!patientId) {
          setError('Patient ID is missing');
          setLoading(false);
          return;
        }

        // Fetch patient profile data
        const { data: patientData, error: patientError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', patientId)
          .single();

        // Separately fetch email from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('email')
          .eq('id', patientId)
          .single();

        if (patientError) {
          console.error('Error fetching patient:', patientError);
          setError(patientError.message);
        } else if (patientData) {
          // Create the patient profile with all required fields
          setPatient({
            id: patientData.id,
            first_name: patientData.first_name || '',
            last_name: patientData.last_name || '',
            email: userData?.email || 'No email available',
            language: patientData.language || '',
          });
        }
        
      } catch (err: any) {
        console.error('Error in fetchPatientDetails:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  const handleGoBack = () => {
    navigate('/clinician/patients');
  };

  // Get full patient name to display
  const patientFullName = patient ? `${patient.first_name} ${patient.last_name}`.trim() : '';

  if (loading) {
    return (
      <ClinicianLayout>
        <PatientDetailSkeleton />
      </ClinicianLayout>
    );
  }

  if (error || !patient) {
    return (
      <ClinicianLayout>
        <PatientDetailError error={error} />
      </ClinicianLayout>
    );
  }

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <h1 className="text-2xl font-bold">
              {patient.first_name} {patient.last_name}'s Profile
            </h1>
          </div>
          <div>
            <MoodReportPDF patientId={patientId as string} patientName={patientFullName} />
          </div>
        </div>

        <div className="grid gap-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            <PatientMoodSection patientId={patientId as string} patientName={patientFullName} />
            <div className="grid gap-6">
              <PatientMoodTimeBreakdown patientId={patientId as string} />
              <PatientTriggerBreakdown patientId={patientId as string} />
            </div>
          </div>
          
          <PatientTasksSection patientId={patientId as string} />
          
          <PatientMoodHistory patientId={patientId as string} />
        </div>
      </div>
    </ClinicianLayout>
  );
}
