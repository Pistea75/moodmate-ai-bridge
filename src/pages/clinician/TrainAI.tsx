
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';

export default function TrainAI() {
  const { user } = useAuth();
  const firstName = user?.user_metadata?.first_name || '';
  
  return (
    <ClinicianLayout>
      <h1 className="text-2xl font-bold mb-2">Dr. {firstName} AI Training</h1>
      <p className="text-muted-foreground -mt-1 mb-6">
        Train your AI to respond in your unique style
      </p>
      <AudioChatInterface isClinicianView />
    </ClinicianLayout>
  );
}
