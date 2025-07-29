
import PatientLayout from '../../layouts/PatientLayout';
import { PatientDirectMessaging } from '@/components/patient/communication/PatientDirectMessaging';

export default function PatientMessages() {
  return (
    <PatientLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Direct Messages</h1>
            <p className="text-muted-foreground">
              Connect with your clinician
            </p>
          </div>
          <PatientDirectMessaging />
        </div>
      </div>
    </PatientLayout>
  );
}
