
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { ProfilePictureUpload } from '@/components/profile/ProfilePictureUpload';

export default function PatientProfile() {
  const { user } = useAuth();
  
  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <ProfilePictureUpload />
            <div className="mt-4">
              <p className="text-muted-foreground">Patient since {new Date(user?.created_at ?? '').toLocaleDateString()}</p>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <ProfileForm
              initialData={{
                full_name: user?.user_metadata?.full_name || '',
                language: user?.user_metadata?.language || 'en'
              }}
              userRole="patient"
            />
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
