
import PatientLayout from '../../layouts/PatientLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useClinicianDetails } from '@/hooks/useClinicianDetails';
import { MessageLimitIndicator } from '@/components/subscription/MessageLimitIndicator';
import { VoiceMinutesIndicator } from '@/components/voice/VoiceMinutesIndicator';
import { PrivacySettings } from '@/components/voice/PrivacySettings';

export default function PatientChat() {
  const { clinicianName } = useClinicianDetails();

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Dr. {clinicianName} AI
          </h1>
          <p className="text-xl text-gray-600">
            AI personalized by your clinician
          </p>
        </div>

        {/* Message Limit Indicator */}
        <MessageLimitIndicator />

        {/* Voice Minutes Indicator */}
        <VoiceMinutesIndicator />

        {/* Privacy Settings */}
        <PrivacySettings />

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border">
          <AudioChatInterface />
        </div>
      </div>
    </PatientLayout>
  );
}
