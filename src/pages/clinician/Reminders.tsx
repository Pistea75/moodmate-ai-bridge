
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AppointmentReminders } from '@/components/clinician/AppointmentReminders';

export default function Reminders() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <AppointmentReminders />
      </div>
    </ClinicianLayout>
  );
}
