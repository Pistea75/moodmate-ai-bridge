
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AudioChatInterface } from '@/components/AudioChatInterface';

export default function TrainAI() {
  return (
    <ClinicianLayout>
      <AudioChatInterface isClinicianView />
    </ClinicianLayout>
  );
}
