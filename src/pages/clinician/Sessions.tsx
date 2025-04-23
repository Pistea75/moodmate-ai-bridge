
import { Calendar, Clock, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function Sessions() {
  const upcomingSessions = [
    {
      id: 1,
      patientName: "Sarah Johnson",
      date: "2025-04-24",
      time: "10:00 AM",
      duration: "50 min",
      status: "upcoming"
    },
    {
      id: 2,
      patientName: "Michael Chen",
      date: "2025-04-24",
      time: "11:30 AM",
      duration: "50 min",
      status: "upcoming"
    },
    // Add more sessions as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sessions</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sessions..."
              className="w-[250px] pl-9"
            />
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90">
            Schedule Session
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {upcomingSessions.map((session) => (
          <Card key={session.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium">{session.patientName}</h3>
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
              </div>
              <Button variant="outline" className="min-w-[100px]">
                Join Session
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
