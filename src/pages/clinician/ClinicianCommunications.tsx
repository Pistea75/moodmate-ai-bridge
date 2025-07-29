
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { CommunicationHub } from '@/components/clinician/CommunicationHub';

export default function ClinicianCommunications() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <CommunicationHub />
      </div>
    </ClinicianLayout>
  );
}
