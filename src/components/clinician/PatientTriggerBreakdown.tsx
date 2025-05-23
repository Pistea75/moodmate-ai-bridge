
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { startOfToday, subDays } from 'date-fns';

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
  const [entryCount, setEntryCount] = useState(0);

  useEffect(() => {
    const fetchTriggers = async () => {
      setLoading(true);
      
      // Calculate date 7 days ago
      const sevenDaysAgo = subDays(startOfToday(), 7);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('triggers, notes, created_at')
        .eq('patient_id', patientId)
        .gte('created_at', sevenDaysAgo.toISOString());

      if (error) {
        console.error('Error fetching triggers:', error.message);
        setLoading(false);
        return;
      }

      // Count the recent entries
      setEntryCount(data?.length || 0);

      const allStats: Record<string, { count: number; notes: string[] }> = {};

      data?.forEach((entry) => {
        const entryNotes = entry.notes?.trim();
        
        // Handle different potential types for triggers with proper type guards
        let validTriggers: string[] = [];
        
        if (entry.triggers) {
          if (Array.isArray(entry.triggers)) {
            // If triggers is already an array, just map and clean it
            validTriggers = entry.triggers
              .filter((t): t is string => typeof t === 'string')
              .map(t => t.trim().toLowerCase())
              .filter(Boolean);
          } else if (typeof entry.triggers === 'string') {
            // If triggers is a string, split it into an array
            validTriggers = entry.triggers
              .split(',')
              .map(t => t.trim().toLowerCase())
              .filter(Boolean);
          }
        }

        validTriggers.forEach((trigger) => {
          if (!trigger) return;
          
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
      <h2 className="text-xl font-semibold mb-2">Top Triggers This Week</h2>
      <p className="text-sm text-muted-foreground mb-4">Based on last 7 days of mood logs</p>
      
      {loading ? (
        <p className="text-muted-foreground text-sm">Loading triggers...</p>
      ) : stats.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {entryCount === 0 ? 'No mood logs in the past week.' : 'No triggers logged in the past week.'}
        </p>
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
