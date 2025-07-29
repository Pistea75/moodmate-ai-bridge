
import { Button } from '@/components/ui/button';
import { Calendar, User, Clock, Send } from 'lucide-react';
import { format } from 'date-fns';

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
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No upcoming sessions</p>
        <p className="text-sm">Sessions will appear here when scheduled</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session) => (
        <div key={session.id} className="p-4 border rounded-lg space-y-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-medium">{session.patient_name}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(session.scheduled_time), 'PPp')}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {session.session_type}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {session.reminder_sent && (
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                  Reminder Sent
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onSendTestReminder(session.id)}
                disabled={loading}
              >
                <Send className="h-3 w-3 mr-1" />
                Test Reminder
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
