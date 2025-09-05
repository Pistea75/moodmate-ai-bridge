
import { Card, CardContent } from '@/components/ui/card';
import { useClinicianProfile } from '@/layouts/clinician/useClinicianProfile';
import { useTranslation } from 'react-i18next';

export function WelcomeBanner() {
  const { t } = useTranslation();
  const { clinicianFullName, isSuperAdmin } = useClinicianProfile();
  
  return (
    <Card className={`${isSuperAdmin ? 'bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 border-gray-700 dark:border-gray-800' : 'bg-gradient-to-r from-mood-purple to-mood-purple/80'} text-white`}>
      <CardContent className="p-6">
        <h1 className="text-2xl font-bold mb-2">
          {t('welcomeBack')}, {isSuperAdmin ? t('admin.superAdmin') : 'Dr.'} {clinicianFullName}!
        </h1>
        <p className={`${isSuperAdmin ? 'text-gray-300 dark:text-gray-400' : 'text-mood-purple-light'}`}>
          {isSuperAdmin 
            ? t('admin.elevatedPrivileges')
            : t('todayOverview')
          }
        </p>
      </CardContent>
    </Card>
  );
}
