
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
  patientId: string;
}

interface TriggerStats {
  trigger: string;
  count: number;
  notes: string[];
}

export function PatientTriggerBreakdown({ patientId }: Props) {
  const [stats, setStats] = useState<TriggerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTriggers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('triggers, notes')
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error fetching triggers:', error.message);
        setLoading(false);
        return;
      }

      const allStats: Record<string, { count: number; notes: string[] }> = {};

      data?.forEach((entry) => {
        const entryNotes = entry.notes?.trim();
        const validTriggers = Array.isArray(entry.triggers)
          ? entry.triggers.map((t) => t.trim().toLowerCase()).filter(Boolean)
          : [];

        validTriggers.forEach((trigger) => {
          if (!allStats[trigger]) {
            allStats[trigger] = { count: 0, notes: [] };
          }

          allStats[trigger].count += 1;
          if (entryNotes) {
            allStats[trigger].notes.push(entryNotes);
          }
        });
      });

      const result: TriggerStats[] = Object.entries(allStats)
        .map(([trigger, { count, notes }]) => ({
          trigger,
          count,
          notes: notes.slice(0, 3), // Limit to 3 recent notes per trigger
        }))
        .sort((a, b) => b.count - a.count);

      setStats(result);
      setLoading(false);
    };

    fetchTriggers();
  }, [patientId]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Top Triggers</h2>
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading triggers...</p>
      ) : stats.length === 0 ? (
        <p className="text-muted-foreground text-sm">No triggers logged yet.</p>
      ) : (
        <div className="space-y-4">
          {stats.map(({ trigger, count, notes }) => (
            <div key={trigger}>
              <Badge variant="outline" className="text-sm mb-1">
                {trigger} <span className="ml-1 text-muted-foreground">({count})</span>
              </Badge>
              {notes.length > 0 && (
                <ul className="list-disc ml-5 mt-1 text-sm text-muted-foreground">
                  {notes.map((note, idx) => (
                    <li key={idx}>{note}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
