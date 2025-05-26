
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';

export default function TrainAI() {
  const { user } = useAuth();
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
      <AudioChatInterface isClinicianView />
    </ClinicianLayout>
  );
}
