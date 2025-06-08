
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientSessions } from '@/hooks/usePatientSessions';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays, Clock } from 'lucide-react';
import { format } from 'date-fns';

export function UpcomingSessionsSection() {
  const { user } = useAuth();
  const { upcomingSession, loading } = usePatientSessions(user?.id || '');

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Upcoming Sessions</h2>
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Upcoming Sessions</h2>
      {upcomingSession ? (
        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <CalendarDays className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-card-foreground">Therapy Session</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(upcomingSession.scheduled_time), 'MMM d, yyyy')} at{' '}
                  {format(new Date(upcomingSession.scheduled_time), 'h:mm a')}
                </span>
                <span>Duration: {upcomingSession.duration_minutes} min</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
          <p className="text-muted-foreground">No upcoming sessions scheduled</p>
        </div>
      )}
    </div>
  );
}
