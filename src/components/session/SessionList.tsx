
import { format, isBefore, isSameDay, addMinutes } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type PatientSession = {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  clinician_name: string;
};

interface SessionListProps {
  sessions: PatientSession[];
  date: Date;
  loading: boolean;
  onScheduleClick: () => void;
}

export const SessionList = ({ sessions, date, loading, onScheduleClick }: SessionListProps) => {
  // Filter sessions for the selected date
  const filteredSessions = sessions.filter((session) =>
    isSameDay(new Date(session.scheduled_time), date)
  );

  // Check if a session is past (includes session duration)
  const isPast = (sessionDate: string, durationMinutes: number = 30) => {
    const sessionTime = new Date(sessionDate);
    const sessionEndTime = addMinutes(sessionTime, durationMinutes);
    return isBefore(sessionEndTime, new Date());
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions scheduled for this date.</p>
        <Button 
          className="mt-4 bg-mood-purple hover:bg-mood-purple/90" 
          onClick={onScheduleClick}
        >
          Schedule Session
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredSessions.map((session) => (
        <Card
          key={session.id}
          className={cn(
            "p-4",
            isPast(session.scheduled_time, session.duration_minutes) ? "bg-muted/50" : ""
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Therapy Session</h3>
                {isPast(session.scheduled_time, session.duration_minutes) && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Completed</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                with {session.clinician_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(session.scheduled_time), "PPP")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(session.scheduled_time), "p")} ({session.duration_minutes} min)
                </span>
              </div>
            </div>
            {!isPast(session.scheduled_time, session.duration_minutes) && (
              <Button variant="outline">View Details</Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
