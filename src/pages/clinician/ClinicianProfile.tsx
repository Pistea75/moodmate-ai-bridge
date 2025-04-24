import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { LogoutButton } from '@/components/LogoutButton';

export default function ClinicianProfile() {
  const { user } = useAuth();
  
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <LogoutButton />
        </div>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <ProfilePictureUpload />
            <div className="mt-4">
              <p className="text-muted-foreground">{user?.user_metadata?.specialization || 'Clinical Professional'}</p>
              <p className="text-sm text-muted-foreground mt-1">License #: {user?.user_metadata?.license_number}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <ProfileForm
              initialData={{
                first_name: user?.user_metadata?.first_name || '',
                last_name: user?.user_metadata?.last_name || '',
                language: user?.user_metadata?.language || 'en',
                specialization: user?.user_metadata?.specialization || '',
                license_number: user?.user_metadata?.license_number || ''
              }}
              userRole="clinician"
            />
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
