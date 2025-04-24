
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';
import { useAuth } from '@/contexts/AuthContext';

export default function TrainAI() {
  const { user } = useAuth();
  const fullName = user?.user_metadata?.full_name || '';
  
  return (
    <ClinicianLayout>
      <h1 className="text-2xl font-bold mb-6">Dr. {fullName} AI Training</h1>
      <AudioChatInterface isClinicianView />
    </ClinicianLayout>
  );
}
