
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { RiskManagementDashboard } from '@/components/clinician/RiskManagementDashboard';

export default function RiskManagement() {
  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Patient Risk Management</h1>
          <p className="text-muted-foreground mt-2">
            Monitor patient risk levels and receive automated alerts for high-risk situations
          </p>
        </div>
        <RiskManagementDashboard />
      </div>
    </ClinicianLayout>
  );
}
