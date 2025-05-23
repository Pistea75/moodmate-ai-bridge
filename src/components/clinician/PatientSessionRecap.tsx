
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import { usePatientSessions } from "@/hooks/usePatientSessions";
import { Skeleton } from "@/components/ui/skeleton";

interface PatientSessionRecapProps {
  patientId: string;
}

export function PatientSessionRecap({ patientId }: PatientSessionRecapProps) {
  const { pastSession, upcomingSession, loading } = usePatientSessions(patientId);

  if (loading) {
    return (
      <Card className="p-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Latest Session Recap</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Upcoming Session</h3>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Latest Session Recap</h3>
        {pastSession ? (
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(pastSession.scheduled_time), "PPP")} 
              {pastSession.timezone && `(${pastSession.timezone})`}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {pastSession.duration_minutes} minutes
            </div>
            {pastSession.notes && (
              <p className="mt-2 text-muted-foreground">
                <strong>Notes:</strong> {pastSession.notes}
              </p>
            )}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No past sessions found.</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Session</h3>
        {upcomingSession ? (
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {format(new Date(upcomingSession.scheduled_time), "PPP")}
              {upcomingSession.timezone && `(${upcomingSession.timezone})`}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {upcomingSession.duration_minutes} minutes
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No upcoming sessions scheduled.</p>
        )}
      </div>
    </Card>
  );
}
