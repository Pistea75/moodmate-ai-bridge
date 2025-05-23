
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
import { Info } from 'lucide-react';

interface Props {
  patientId: string;
}

interface Session {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  timezone: string | null;
  notes?: string;
}

export function PatientSessionRecap({ patientId }: Props) {
  const [latest, setLatest] = useState<Session | null>(null);
  const [upcoming, setUpcoming] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from('sessions')
        .select('id, scheduled_time, duration_minutes, status, timezone, notes')
        .eq('patient_id', patientId)
        .order('scheduled_time', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        setLoading(false);
        return;
      }

      const past = data?.filter(s => s.scheduled_time < now);
      const future = data?.filter(s => s.scheduled_time >= now);

      setLatest(past?.[0] || null);
      setUpcoming(future?.[future.length - 1] || null);
      setLoading(false);
    };

    fetchSessions();
  }, [patientId]);

  if (loading) {
    return (
      <Card className="p-4 text-sm text-muted-foreground">
        Loading session details...
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {latest && (
        <Card className="p-4">
          <h3 className="font-medium mb-1">📝 Last Session</h3>
          <p className="text-sm text-muted-foreground mb-1">
            {format(new Date(latest.scheduled_time), 'MMMM d, yyyy • h:mm a')} ({latest.timezone || 'UTC'})
          </p>
          {latest.notes ? (
            <p className="text-sm">{latest.notes}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">No notes provided.</p>
          )}
        </Card>
      )}

      {upcoming && (
        <Card className="p-4">
          <h3 className="font-medium mb-1">📅 Next Session</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(upcoming.scheduled_time), 'MMMM d, yyyy • h:mm a')} ({upcoming.timezone || 'UTC'})
          </p>
        </Card>
      )}

      {!latest && !upcoming && (
        <Card className="p-4 text-sm text-muted-foreground">
          <Info className="inline-block w-4 h-4 mr-1" />
          No session data available for this patient.
        </Card>
      )}
    </div>
  );
}
