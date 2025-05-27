
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PatientSelector } from '@/components/session/PatientSelector';
import { PatientTasksSection } from './PatientTasksSection';

export function PatientTasksCard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');

  return (
    <Card>
      <CardHeader>
        <div className="space-y-4">
          <CardTitle>Patient Tasks</CardTitle>
          <PatientSelector 
            value={selectedPatientId} 
            onChange={setSelectedPatientId}
            placeholder="Select a patient to view their tasks"
          />
        </div>
      </CardHeader>
      <CardContent>
        {selectedPatientId ? (
          <PatientTasksSection patientId={selectedPatientId} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Select a patient to view their assigned tasks
          </div>
        )}
      </CardContent>
    </Card>
  );
}
