
import { Session, SessionCard } from '@/components/SessionCard';
import { Skeleton } from "@/components/ui/skeleton";

interface UpcomingSessionsProps {
  sessions: any[];
  loading: boolean;
}

export function UpcomingSessions({ sessions, loading }: UpcomingSessionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
        <a href="/clinician/sessions" className="text-sm text-mood-purple hover:underline">View All</a>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : sessions.length > 0 ? (
        <div className="space-y-4">
          {sessions.map((session: any) => (
            <SessionCard
              key={session.id}
              session={{
                id: session.id,
                title: 'Therapy Session',
                dateTime: session.scheduled_time,
                duration: session.duration_minutes,
                patientName: `${session.patient.first_name} ${session.patient.last_name}`,
                status: 'upcoming'
              }}
              variant="clinician"
            />
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground text-sm">No upcoming sessions.</div>
      )}
    </div>
  );
}
