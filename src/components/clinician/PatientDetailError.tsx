
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PatientDetailErrorProps {
  error: string | null;
}

export function PatientDetailError({ error }: PatientDetailErrorProps) {
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate('/clinician/patients');
  };
  
  return (
    <>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error || 'Patient not found'}
        </AlertDescription>
      </Alert>
      <Button onClick={handleGoBack} variant="outline" className="mt-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Patients
      </Button>
    </>
  );
}
