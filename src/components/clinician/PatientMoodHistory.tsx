
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { isHighRiskMood } from '@/lib/utils/alertTriggers';
import { MOOD_LABELS, MOOD_COLORS } from '@/components/mood/MoodChartConstants';
import { Badge } from '@/components/ui/badge';
import { normalizeMood } from '@/components/mood/MoodChartUtils';
import { cn } from '@/lib/utils';

interface MoodEntry {
  created_at: string;
  mood_score: number;
  notes: string | null;
  triggers: string[] | null;
}

export function PatientMoodHistory({ patientId }: { patientId: string }) {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodHistory = async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at, mood_score, notes, triggers')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setEntries(data);
      }
      setLoading(false);
    };

    fetchMoodHistory();
  }, [patientId]);

  const formatTriggers = (triggers: string[] | null) => {
    if (!triggers || triggers.length === 0) return '—';
    
    return (
      <div className="flex flex-wrap gap-1">
        {triggers.map((trigger, idx) => (
          <Badge key={idx} variant="outline" className="text-xs bg-muted">
            {trigger}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Mood History</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : entries.length === 0 ? (
        <p className="text-muted-foreground">No entries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mood</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                const normalized = normalizeMood(entry.mood_score) - 1;
                const flagged = isHighRiskMood(entry.mood_score, entry.triggers || []);
                const isLowMood = normalized <= 1; // Mood scores 1-2 (normalized to 0-1)
                const isStriped = index % 2 === 1;
                
                return (
                  <TableRow
                    key={index}
                    className={cn(
                      isStriped ? 'bg-muted/10' : '',
                      flagged ? 'bg-red-50 text-red-700' : 
                      isLowMood ? 'bg-red-50/50' : ''
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: MOOD_COLORS[normalized] }}
                        />
                        <span>
                          {entry.mood_score} – {MOOD_LABELS[normalized]}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={entry.notes || ''}>
                      {entry.notes || '—'}
                    </TableCell>
                    <TableCell>
                      {formatTriggers(entry.triggers)}
                    </TableCell>
                    <TableCell>
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
}
