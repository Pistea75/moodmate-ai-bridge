
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutButton } from '@/components/LogoutButton';
import { DeleteProfileButton } from '@/components/profile/DeleteProfileButton';
import { PatientSummaryStats } from '@/components/clinician/PatientSummaryStats';

export default function PatientProfile() {
  const { user } = useAuth();
  
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <LogoutButton />
            <DeleteProfileButton />
          </div>
        </div>
        
        {/* Add PatientSummaryStats component */}
        {user?.id && <PatientSummaryStats patientId={user.id} />}
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <ProfileForm
              initialData={{
                first_name: user?.user_metadata?.first_name || '',
                last_name: user?.user_metadata?.last_name || '',
                language: user?.user_metadata?.language || 'en'
              }}
              userRole="patient"
            />
            <div className="mt-4 text-sm text-muted-foreground">
              Patient since {new Date(user?.created_at ?? '').toLocaleDateString()}
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
