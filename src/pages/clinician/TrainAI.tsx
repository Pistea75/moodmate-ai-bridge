
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { PatientSelectorForAI } from '@/components/clinician/PatientSelectorForAI';
import { AIPersonalizationModal } from '@/components/clinician/AIPersonalizationModal';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function TrainAI() {
  const { user } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const firstName = user?.user_metadata?.first_name || '';
  
  return (
    <ClinicianLayout>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Dr. {firstName} AI Chat</h1>
          <p className="text-muted-foreground -mt-1">
            Train your AI to respond in your unique style
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center justify-between">
          <PatientSelectorForAI
            selectedPatientId={selectedPatientId}
            onPatientSelect={setSelectedPatientId}
          />
          {selectedPatientId && (
            <AIPersonalizationModal
              patientId={selectedPatientId}
              clinicianId={user?.id}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  Configure AI Personalization
                </Button>
              }
            />
          )}
        </div>
        {selectedPatientId && (
          <div className="mt-2 text-sm text-muted-foreground">
            AI responses will be personalized based on this patient's profile and preferences.
          </div>
        )}
      </div>

      <AudioChatInterface 
        isClinicianView 
        selectedPatientId={selectedPatientId}
      />
    </ClinicianLayout>
  );
}
