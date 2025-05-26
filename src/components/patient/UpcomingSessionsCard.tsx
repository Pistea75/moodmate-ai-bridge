
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SessionCard } from '@/components/SessionCard';
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientSessions } from '@/hooks/usePatientSessions';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays } from 'lucide-react';

export function UpcomingSessionsCard() {
  const { user } = useAuth();
  const { upcomingSession, loading } = usePatientSessions(user?.id || '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Upcoming Sessions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-20 w-full" />
        ) : upcomingSession ? (
          <SessionCard
            session={{
              id: upcomingSession.id,
              title: 'Therapy Session',
              dateTime: upcomingSession.scheduled_time,
              duration: upcomingSession.duration_minutes,
              patientName: '', // Not needed for patient view
              status: 'upcoming'
            }}
            variant="patient"
          />
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No upcoming sessions scheduled
          </div>
        )}
      </CardContent>
    </Card>
  );
}
