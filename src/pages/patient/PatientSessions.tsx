
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Calendar, Clock } from "lucide-react";
import { useState } from 'react';
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from '@/lib/utils';

export default function PatientSessions() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const today = new Date();
  
  const sessions = [
    {
      id: 1,
      type: "Weekly Therapy",
      clinician: "Dr. Sarah Johnson",
      date: "2025-04-22",
      time: "10:00 AM",
      duration: "50 min",
      status: "completed"
    },
    {
      id: 2,
      type: "Follow-up Session",
      clinician: "Dr. Sarah Johnson",
      date: "2025-04-24",
      time: "11:30 AM",
      duration: "30 min",
      status: "upcoming"
    },
    {
      id: 3,
      type: "Medication Review",
      clinician: "Dr. Robert Chen",
      date: "2025-04-30",
      time: "09:15 AM",
      duration: "25 min",
      status: "upcoming"
    }
  ];
  
  // Filter sessions based on selected date
  const filteredSessions = date 
    ? sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate.getDate() === date.getDate() && 
               sessionDate.getMonth() === date.getMonth() && 
               sessionDate.getFullYear() === date.getFullYear();
      }) 
    : sessions;

  // Check if a session is in the past
  const isPastSession = (sessionDate: string) => {
    const session = new Date(sessionDate);
    return session < today;
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button className="bg-mood-purple hover:bg-mood-purple/90">
              Schedule Session
            </Button>
          </div>
        </div>

        {filteredSessions.length > 0 ? (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card 
                key={session.id} 
                className={cn(
                  "p-4",
                  isPastSession(session.date) || session.status === "completed" ? 
                  "bg-muted/50" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{session.type}</h3>
                      {(isPastSession(session.date) || session.status === "completed") && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">Completed</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      with {session.clinician}
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
                  
                  {!(isPastSession(session.date) || session.status === "completed") && (
                    <Button variant="outline">
                      View Details
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions scheduled for this date.</p>
            <Button className="mt-4 bg-mood-purple hover:bg-mood-purple/90">
              Schedule Session
            </Button>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
