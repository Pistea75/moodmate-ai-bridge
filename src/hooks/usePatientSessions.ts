
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Session {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  notes?: string;
  timezone: string;
}

export function usePatientSessions(patientId: string) {
  const [pastSession, setPastSession] = useState<Session | null>(null);
  const [upcomingSession, setUpcomingSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;

    const fetchSessions = async () => {
      setLoading(true);

      try {
        // Fetch latest past session
        const { data: past, error: pastError } = await supabase
          .from('sessions')
          .select('*')
          .eq('patient_id', patientId)
          .lt('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (pastError) {
          console.error('Error fetching past session:', pastError);
        }

        // Fetch next upcoming session
        const { data: upcoming, error: upcomingError } = await supabase
          .from('sessions')
          .select('*')
          .eq('patient_id', patientId)
          .gt('scheduled_time', new Date().toISOString())
          .order('scheduled_time', { ascending: true })
          .limit(1)
          .maybeSingle();

        if (upcomingError) {
          console.error('Error fetching upcoming session:', upcomingError);
        }

        setPastSession(past ?? null);
        setUpcomingSession(upcoming ?? null);
      } catch (error) {
        console.error('Unexpected error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [patientId]);

  return { pastSession, upcomingSession, loading };
}
