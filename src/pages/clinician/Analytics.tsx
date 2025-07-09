
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { AdvancedAnalytics } from '@/components/clinician/AdvancedAnalytics';

export default function Analytics() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <AdvancedAnalytics />
      </div>
    </ClinicianLayout>
  );
}
