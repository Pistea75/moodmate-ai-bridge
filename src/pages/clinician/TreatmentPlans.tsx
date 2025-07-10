
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { TreatmentPlans } from '@/components/clinician/TreatmentPlans';

export default function TreatmentPlansPage() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <TreatmentPlans />
      </div>
    </ClinicianLayout>
  );
}
