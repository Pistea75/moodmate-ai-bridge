
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { getStartOfWeek } from '@/lib/utils/dateHelpers';

interface Props {
  patientId: string;
}

export function PatientSummaryStats({ patientId }: Props) {
  const [avgMood, setAvgMood] = useState<number | null>(null);
  const [taskStats, setTaskStats] = useState<{ total: number; completed: number; upcoming: number }>({
    total: 0,
    completed: 0,
    upcoming: 0,
  });

  useEffect(() => {
    const fetchMoodStats = async () => {
      const startOfWeek = getStartOfWeek();
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score')
        .eq('patient_id', patientId)
        .gte('created_at', startOfWeek);

      if (!error && data?.length) {
        const total = data.reduce((sum, entry) => sum + entry.mood_score, 0);
        setAvgMood(total / data.length);
      }
    };

    const fetchTaskStats = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('completed, due_date')
        .eq('patient_id', patientId);

      if (!error && data) {
        const total = data.length;
        const completed = data.filter((t) => t.completed).length;
        const upcoming = data.filter((t) => new Date(t.due_date) > new Date()).length;
        setTaskStats({ total, completed, upcoming });
      }
    };

    fetchMoodStats();
    fetchTaskStats();
  }, [patientId]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <h4 className="text-sm text-muted-foreground mb-1">Avg Mood (This Week)</h4>
        <p className="text-xl font-semibold">
          {avgMood ? avgMood.toFixed(1) : '—'}
        </p>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm text-muted-foreground mb-1">Tasks Completed</h4>
        <p className="text-xl font-semibold">
          {taskStats.completed} / {taskStats.total}
        </p>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm text-muted-foreground mb-1">Upcoming Tasks</h4>
        <p className="text-xl font-semibold">{taskStats.upcoming}</p>
      </Card>
    </div>
  );
}
