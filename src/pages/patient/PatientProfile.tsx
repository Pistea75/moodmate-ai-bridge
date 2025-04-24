
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientProfile() {
  const { user } = useAuth();
  
  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                <User className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user?.user_metadata?.full_name}</h2>
                <p className="text-muted-foreground">Patient since {new Date(user?.created_at ?? '').toLocaleDateString()}</p>
                <Button variant="outline" className="mt-4">
                  Change Profile Picture
                </Button>
              </div>
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
