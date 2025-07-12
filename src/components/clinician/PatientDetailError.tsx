
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PatientDetailErrorProps {
  error: string | null;
  onRetry?: () => void;
}

export function PatientDetailError({ error, onRetry }: PatientDetailErrorProps) {
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
      <div className="flex gap-2 mt-4">
        <Button onClick={handleGoBack} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Patients
        </Button>
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            Retry
          </Button>
        )}
      </div>
    </>
  );
}
