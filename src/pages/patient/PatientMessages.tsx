
import PatientLayout from '../../layouts/PatientLayout';
import { PatientDirectMessaging } from '@/components/patient/communication/PatientDirectMessaging';
import { useTranslation } from 'react-i18next';

export default function PatientMessages() {
  const { t } = useTranslation();
  
  return (
    <PatientLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{t('directMessages')}</h1>
            <p className="text-muted-foreground">
              {t('connectWithClinician')}
            </p>
          </div>
          <PatientDirectMessaging />
        </div>
      </div>
    </PatientLayout>
  );
}
