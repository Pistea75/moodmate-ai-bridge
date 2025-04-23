
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default function PatientProfile() {
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
                <h2 className="text-xl font-semibold">Alex Smith</h2>
                <p className="text-muted-foreground">Patient since April 2025</p>
                <Button variant="outline" className="mt-4">
                  Change Profile Picture
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  value="Alex Smith"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  type="email"
                  value="alex.smith@example.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <input
                  type="tel"
                  value="+1 (555) 123-4567"
                  className="w-full mt-1 px-3 py-2 border rounded-md"
                />
              </div>
              <Button className="bg-mood-purple hover:bg-mood-purple/90">
                Save Changes
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
