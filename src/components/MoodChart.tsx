
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

type ViewMode = 'weekly' | 'daily';

const MOOD_LABELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
const MOOD_COLORS = ['#F87171', '#FCD34D', '#A3E635', '#34D399', '#60A5FA'];

interface MoodEntry {
  created_at: string;
  mood_score: number;
}

interface ChartData {
  label: string;
  mood: number | null;
}

// Tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const mood = payload[0].value;
    if (mood === null) {
      return (
        <div className="bg-background p-3 rounded-md shadow-md border">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">No entry</p>
        </div>
      );
    }

    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: MOOD_COLORS[mood - 1] }}
          />
          <p className="text-sm">{MOOD_LABELS[mood - 1]}</p>
        </div>
      </div>
    );
  }
  return null;
};

export function MoodChart() {
  const [data, setData] = useState<ChartData[]>([]);
  const [view, setView] = useState<ViewMode>('weekly');
  const { toast } = useToast();

  const fetchMoodData = async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not authenticated',
      });
      return;
    }

    const { data: entries, error } = await supabase
      .from('mood_entries')
      .select('mood_score, created_at')
      .eq('patient_id', userData.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load mood data',
        description: error.message,
      });
      return;
    }

    const parsed = parseEntries(entries || [], view);
    setData(parsed);
  };

  const normalizeMood = (score: number) =>
    Math.max(1, Math.min(5, Math.ceil(score / 2)));

  const parseEntries = (entries: MoodEntry[], view: ViewMode): ChartData[] => {
    if (view === 'weekly') {
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());

      const moodMap: Record<number, number[]> = {};

      entries.forEach((entry) => {
        const date = new Date(entry.created_at);
        const dayIndex = date.getDay();
        if (!moodMap[dayIndex]) moodMap[dayIndex] = [];
        moodMap[dayIndex].push(normalizeMood(entry.mood_score));
      });

      const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

      return Array.from({ length: 7 }, (_, i) => {
        const moods = moodMap[i] || [];
        const average =
          moods.length > 0
            ? Math.round(moods.reduce((sum, val) => sum + val, 0) / moods.length)
            : null;

        return {
          label: weekLabels[i],
          mood: average,
        };
      });
    }

    // Daily view
    const timeMap: Record<string, number[]> = {};

    entries.forEach((entry) => {
      const date = new Date(entry.created_at);
      const time = date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (!timeMap[time]) timeMap[time] = [];
      timeMap[time].push(normalizeMood(entry.mood_score));
    });

    return Object.entries(timeMap).map(([label, moods]) => ({
      label,
      mood: Math.round(moods.reduce((sum, m) => sum + m, 0) / moods.length),
    }));
  };

  useEffect(() => {
    fetchMoodData();
  }, [view]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Mood Timeline</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('weekly')}
            className={view === 'weekly' ? 'bg-mood-purple text-white' : ''}
          >
            Weekly
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('daily')}
            className={view === 'daily' ? 'bg-mood-purple text-white' : ''}
          >
            Daily
          </Button>
        </div>
      </div>

      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tickFormatter={(val) => MOOD_LABELS[val - 1]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#9b87f5"
              strokeWidth={3}
              dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
              activeDot={{ fill: '#6E59A5', r: 6 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {view === 'daily' && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          Daily view (grouped by time)
        </div>
      )}
    </div>
  );
}


