
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Video } from "lucide-react";

export default function Sessions() {
  const sessions = [
    {
      id: 1,
      type: "Weekly Therapy",
      patient: "Sarah Johnson",
      date: "2025-04-24",
      time: "10:00 AM",
      duration: "50 min",
      status: "upcoming"
    },
    {
      id: 2,
      type: "Follow-up Session",
      patient: "Michael Chen",
      date: "2025-05-01",
      time: "11:30 AM",
      duration: "30 min",
      status: "upcoming"
    }
  ];

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90">
            Schedule Session
          </Button>
        </div>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{session.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    with {session.patient}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {session.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {session.time} ({session.duration})
                    </span>
                  </div>
                </div>
                <Button className="gap-2">
                  <Video className="h-4 w-4" />
                  Join Session
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
}

