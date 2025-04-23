
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function ClinicianProfile() {
  return (
    <ClinicianLayout>
      <div className="space

-y-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                <User className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold">Dr. Sarah Johnson</h2>
                <p className="text-muted-foreground">Clinical Psychologist</p>
                <p className="text-sm text-muted-foreground mt-1">License #: PSY12345</p>
                <Button variant="outline" className="mt-4">
                  Change Profile Picture
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value="Dr. Sarah Johnson"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Specialization</label>
                <input
                  type="text"
                  value="Clinical Psychology"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">License Number</label>
                <input
                  type="text"
                  value="PSY12345"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value="dr.johnson@example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value="+1 (555) 987-6543"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <Button className="bg-mood-purple hover:bg-mood-purple/90">
                Save Changes
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Practice Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Practice Name</label>
                <input
                  type="text"
                  value="Wellness Mental Health Center"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                  rows={3}
                >123 Therapy Street, Suite 100, Mental Health City, MH 12345</textarea>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
