
import { AudioChatInterface } from '@/components/AudioChatInterface';
import PatientLayout from '../../layouts/PatientLayout';
import { useClinicianDetails } from '@/hooks/useClinicianDetails';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientChat() {
  const { clinicianName, loading } = useClinicianDetails();
  const { user } = useAuth();

  // Custom system prompt for CBT-focused assistance
  const systemPrompt = "You are a supportive mental health assistant trained in CBT. Your goal is to help users process difficult thoughts, challenge cognitive distortions, and identify positive coping strategies. Always be empathetic, evidence-based, and non-judgmental. Address the user as a caring professional would, but do not diagnose or provide medical advice.";

  return (
    <PatientLayout>
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex items-center justify-center h-[calc(100vh-200px)]">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <AudioChatInterface 
            clinicianName={clinicianName || 'Martinez'} 
            systemPrompt={systemPrompt}
            patientId={user?.id}
          />
        )}
      </div>
    </PatientLayout>
  );
}
