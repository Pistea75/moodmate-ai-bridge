
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { PatientSelectorForAI } from '@/components/clinician/PatientSelectorForAI';
import { AIPersonalizationModal } from '@/components/clinician/AIPersonalizationModal';
import { Button } from '@/components/ui/button';
import { Settings, Users, Brain, BarChart, Calendar, CheckSquare } from 'lucide-react';
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
            Train your AI with complete access to patient data
          </p>
        </div>
      </div>

      {/* Enhanced Info Card */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Brain className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Full Data Access AI Assistant</h3>
              <p className="text-sm text-blue-800 mb-3">
                The AI now has comprehensive access to all your patient data for in-depth clinical discussions:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-blue-700">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Patient profiles & contact information</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart className="h-4 w-4" />
                  <span>Mood logs, charts & trend analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span>AI personalization settings & preferences</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4" />
                  <span>Task completion & exercise logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Session notes & attendance history</span>
                </div>
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Treatment goals & clinical assessments</span>
                </div>
              </div>
              <p className="text-sm text-blue-800 mt-3 font-medium">
                Ask about specific patients, analyze trends, compare progress, or get clinical insights based on real data.
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
