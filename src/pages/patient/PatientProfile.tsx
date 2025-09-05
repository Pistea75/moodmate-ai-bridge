
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { LogoutButton } from '@/components/LogoutButton';
import { DeleteProfileButton } from '@/components/profile/DeleteProfileButton';
import { PatientSummaryStats } from '@/components/clinician/PatientSummaryStats';

export default function PatientProfile() {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">{t('myProfile')}</h1>
          </div>
          <div className="flex gap-2">
            <LogoutButton />
            <DeleteProfileButton />
          </div>
        </div>
        
        {/* Add PatientSummaryStats component */}
        {user?.id && <PatientSummaryStats patientId={user.id} />}
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('personalInformation')}</h2>
            <ProfileForm
              initialData={{
                first_name: user?.user_metadata?.first_name || '',
                last_name: user?.user_metadata?.last_name || '',
                language: user?.user_metadata?.language || 'en'
              }}
              userRole="patient"
            />
            <div className="mt-4 text-sm text-muted-foreground">
              {t('patientSince')} {new Date(user?.created_at ?? '').toLocaleDateString()}
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
