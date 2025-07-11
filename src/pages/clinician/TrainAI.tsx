
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { PatientSelectorForAI } from '@/components/clinician/PatientSelectorForAI';
import { AIPersonalizationModal } from '@/components/clinician/AIPersonalizationModal';
import { Button } from '@/components/ui/button';
import { Settings, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

      {/* New Info Card */}
      <Card className="mb-6 bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900 mb-1">Enhanced AI Capabilities</h3>
              <p className="text-sm text-blue-800">
                The AI now has access to your patient list and can discuss specific patients by name for personalization, 
                treatment planning, and clinical insights. You can reference patients directly in your conversations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
