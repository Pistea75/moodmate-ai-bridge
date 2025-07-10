
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface UpcomingSession {
  id: string;
  patient_name: string;
  scheduled_time: string;
  session_type: string;
  reminder_sent: boolean;
}

interface UpcomingSessionsListProps {
  sessions: UpcomingSession[];
  onSendTestReminder: (sessionId: string) => void;
  loading: boolean;
}

export function UpcomingSessionsList({ sessions, onSendTestReminder, loading }: UpcomingSessionsListProps) {
  return (
    <div className="space-y-3">
      {sessions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No upcoming sessions in the next 7 days
        </div>
      ) : (
        sessions.map((session) => (
          <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <p className="font-medium">{session.patient_name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(session.scheduled_time).toLocaleDateString()} at{' '}
                {new Date(session.scheduled_time).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
              <p className="text-xs text-muted-foreground">{session.session_type}</p>
            </div>
            <div className="flex items-center gap-2">
              {session.reminder_sent && (
                <Badge variant="secondary">Reminder Sent</Badge>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onSendTestReminder(session.id)}
                disabled={loading}
              >
                Test Reminder
              </Button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
