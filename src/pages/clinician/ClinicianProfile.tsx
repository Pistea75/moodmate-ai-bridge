
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ClinicianProfile() {
  const { user } = useAuth();
  
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  <User className="h-12 w-12 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">{user?.user_metadata?.full_name}</h2>
                <p className="text-muted-foreground">{user?.user_metadata?.specialization || 'Clinical Professional'}</p>
                <p className="text-sm text-muted-foreground mt-1">License #: {user?.user_metadata?.license_number}</p>
                <Button variant="outline" className="mt-4">
                  Change Profile Picture
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <ProfileForm
              initialData={{
                full_name: user?.user_metadata?.full_name || '',
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
