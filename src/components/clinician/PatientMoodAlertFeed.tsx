
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { isHighRiskMood } from '@/lib/utils/alertTriggers';
import { format } from 'date-fns';

interface Props {
  patientId: string;
}

interface MoodEntry {
  id: string;
  mood_score: number;
  triggers: string[] | null;
  created_at: string;
}

export function PatientMoodAlertFeed({ patientId }: Props) {
  const [alerts, setAlerts] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('mood_entries')
        .select('id, mood_score, triggers, created_at')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading mood entries:', error);
        setLoading(false);
        return;
      }

      const flagged = (data || []).filter((entry) =>
        isHighRiskMood(entry.mood_score, entry.triggers || [])
      );

      setAlerts(flagged);
      setLoading(false);
    };

    fetchAlerts();
  }, [patientId]);

  return (
    <Card className="p-4">
      <h3 className="font-medium mb-2">⚠️ Mood Alerts</h3>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading alerts...</p>
      ) : alerts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No critical entries found.</p>
      ) : (
        <ul className="space-y-2">
          {alerts.map((entry) => (
            <li key={entry.id} className="text-sm">
              <span className="text-red-600 font-semibold">Critical mood {entry.mood_score}</span> —{' '}
              {entry.triggers?.join(', ') || 'No triggers'}
              <div className="text-muted-foreground text-xs">
                {format(new Date(entry.created_at), 'MMM d, yyyy h:mm a')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
