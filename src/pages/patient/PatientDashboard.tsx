
import PatientLayout from '../../layouts/PatientLayout';
import { EnhancedPatientDashboard } from '@/components/patient/EnhancedPatientDashboard';

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('patientDashboard')}</h1>
            <p className="text-muted-foreground">
              {t('yourMentalHealthOverview')}
            </p>
          </div>
        </div>
        
        <EnhancedPatientDashboard />
      </div>
    </PatientLayout>
  );
}
