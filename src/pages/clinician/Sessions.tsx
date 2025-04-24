
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Mic } from "lucide-react";
import { SessionCard } from "@/components/SessionCard";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function Sessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState([
    {
      id: "1",
      title: "Weekly Therapy",
      dateTime: "2025-04-24T10:00:00",
      duration: 50,
      patientName: "Sarah Johnson",
      notes: "Focus on anxiety management techniques",
      status: "upcoming" as const
    },
    {
      id: "2",
      title: "Follow-up Session",
      dateTime: "2025-05-01T11:30:00",
      duration: 30,
      patientName: "Michael Chen",
      notes: "Review progress on sleep habits",
      status: "upcoming" as const
    }
  ]);

  const handleScheduleSession = () => {
    toast({
      title: "Session Scheduled",
      description: "New session has been scheduled successfully.",
    });
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90" onClick={handleScheduleSession}>
            Schedule Session
          </Button>
        </div>

        <Card className="p-4 mb-4 bg-muted/30">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-1">
            <div className="flex-shrink-0 bg-mood-purple/10 p-3 rounded-full">
              <Mic className="h-6 w-6 text-mood-purple" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-base">Session Recording</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Record your therapy sessions to generate AI-powered reports and insights automatically.
                The audio is securely encrypted and can be automatically deleted after processing.
              </p>
            </div>
            <div className="flex-shrink-0 w-full md:w-auto">
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid gap-4">
          {sessions.map((session) => (
            <SessionCard
              key={session.id}
              session={session}
              variant="clinician"
            />
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
}
