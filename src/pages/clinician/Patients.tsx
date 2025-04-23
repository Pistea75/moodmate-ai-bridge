
import { Search, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ClinicianLayout from '../../layouts/ClinicianLayout';

const patients = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastSession: "2025-04-20",
    nextSession: "2025-04-27",
    status: "Active",
    progress: "Improving"
  },
  {
    id: 2,
    name: "Michael Chen",
    lastSession: "2025-04-19",
    nextSession: "2025-04-26",
    status: "Active",
    progress: "Stable"
  },
  {
    id: 3,
    name: "Emily Wilson",
    lastSession: "2025-04-18",
    nextSession: "2025-04-25",
    status: "Active",
    progress: "Needs Attention"
  }
];

export default function Patients() {
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Patients</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="w-[250px] pl-9"
              />
            </div>
            <Button className="bg-mood-purple hover:bg-mood-purple/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {patients.map((patient) => (
            <Card key={patient.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{patient.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Last Session: {patient.lastSession}</span>
                    <span>•</span>
                    <span>Next Session: {patient.nextSession}</span>
                    <span>•</span>
                    <span>Progress: {patient.progress}</span>
                  </div>
                </div>
                <Button variant="outline">View Profile</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
}
