
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';
import { LogoutButton } from '@/components/LogoutButton';
import { DeleteProfileButton } from '@/components/profile/DeleteProfileButton';
import { ReferralCodeDisplay } from '@/components/clinician/ReferralCodeDisplay';

export default function ClinicianProfile() {
  const { user } = useAuth();
  
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <div className="flex gap-2">
            <LogoutButton />
            <DeleteProfileButton />
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <ProfilePictureUpload />
            <div className="mt-4">
              <p className="text-muted-foreground">{user?.user_metadata?.specialization || 'Clinical Professional'}</p>
              <p className="text-sm text-muted-foreground mt-1">License #: {user?.user_metadata?.license_number}</p>
            </div>
          </Card>

          <ReferralCodeDisplay />

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Professional Information</h2>
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
