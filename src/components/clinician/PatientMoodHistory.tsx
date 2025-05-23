
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { isHighRiskMood } from '@/lib/utils/alertTriggers';
import { format } from 'date-fns';

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

  const getMoodLabel = (score: number) => {
    const norm = Math.ceil(score / 2);
    return ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'][norm - 1];
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
                <TableHead>Date</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Triggers</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>⚠️</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                const flagged = isHighRiskMood(entry.mood_score, entry.triggers || []);
                return (
                  <TableRow
                    key={index}
                    className={flagged ? 'bg-red-50 text-red-700' : ''}
                  >
                    <TableCell>{format(new Date(entry.created_at), 'MMM dd')}</TableCell>
                    <TableCell>{entry.mood_score}</TableCell>
                    <TableCell>{getMoodLabel(entry.mood_score)}</TableCell>
                    <TableCell>{(entry.triggers || []).join(', ')}</TableCell>
                    <TableCell className="max-w-xs truncate">{entry.notes || '-'}</TableCell>
                    <TableCell>{flagged ? '🚨' : ''}</TableCell>
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
