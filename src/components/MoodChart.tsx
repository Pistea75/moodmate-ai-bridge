
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  TooltipProps,
} from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, ZoomIn, ZoomOut } from 'lucide-react';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { format } from 'date-fns';

const MOOD_LEVELS = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];
const MOOD_COLORS = ['#F87171', '#FCD34D', '#A3E635', '#34D399', '#60A5FA'];

type ChartView = 'weekly' | 'daily' | 'hourly';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const moodValue = payload[0].value as number;
    const moodLabel = MOOD_LEVELS[moodValue - 1];
    const moodColor = MOOD_COLORS[moodValue - 1];

    return (
      <div className="bg-background p-3 rounded-md shadow-md border">
        <p className="text-sm font-medium">{label}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="size-3 rounded-full" style={{ backgroundColor: moodColor }} />
          <p className="text-sm">{moodLabel}</p>
        </div>
      </div>
    );
  }

  return null;
};

// 🔁 Mood transformation helper
function transformMoodData(moods: any[], view: ChartView) {
  const mapMood = (score: number) => Math.ceil(score / 2); // 1–10 ➜ 1–5
  const now = new Date();

  if (view === 'weekly') {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(now);
      d.setDate(d.getDate() - (6 - i));
      const label = format(d, 'EEE');

      const dayEntries = moods.filter(
        (m) => format(new Date(m.created_at), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
      );

      const avgMood =
        dayEntries.length > 0
          ? Math.round(
              dayEntries.reduce((sum, m) => sum + mapMood(m.mood_score), 0) / dayEntries.length
            )
          : null;

      return { day: label, mood: avgMood };
    });
  }

  if (view === 'daily') {
    const today = format(now, 'yyyy-MM-dd');
    return Array.from({ length: 12 }).map((_, i) => {
      const hour = i * 2;
      const label = `${hour === 0 ? '12' : hour % 12} ${hour < 12 ? 'AM' : 'PM'}`;

      const entries = moods.filter((m) => {
        const date = new Date(m.created_at);
        return (
          format(date, 'yyyy-MM-dd') === today &&
          date.getHours() >= hour &&
          date.getHours() < hour + 2
        );
      });

      const avgMood =
        entries.length > 0
          ? Math.round(
              entries.reduce((sum, m) => sum + mapMood(m.mood_score), 0) / entries.length
            )
          : null;

      return { hour: label, mood: avgMood };
    });
  }

  if (view === 'hourly') {
    const today = format(now, 'yyyy-MM-dd');
    return moods
      .filter((m) => format(new Date(m.created_at), 'yyyy-MM-dd') === today)
      .map((m) => ({
        time: format(new Date(m.created_at), 'HH:mm'),
        mood: mapMood(m.mood_score),
      }));
  }

  return [];
}

export function MoodChart() {
  const { moods, loading } = useMoodEntries();
  const [view, setView] = useState<ChartView>('weekly');
  const [previousView, setPreviousView] = useState<ChartView | null>(null);

  const data = transformMoodData(moods, view);
  const dataKey = view === 'weekly' ? 'day' : view === 'daily' ? 'hour' : 'time';

  const handleZoomIn = () => {
    if (view === 'weekly') {
      setPreviousView('weekly');
      setView('daily');
    } else if (view === 'daily') {
      setPreviousView('daily');
      setView('hourly');
    }
  };

  const handleZoomOut = () => {
    if (view === 'hourly') {
      setView('daily');
    } else if (view === 'daily') {
      setView('weekly');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Mood Timeline</h3>
        <div className="flex gap-2">
          <div className="flex">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={view === 'weekly'}
              className="rounded-r-none border-r-0"
            >
              <ZoomOut size={16} />
              <span className="sr-only">Zoom Out</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={view === 'hourly'}
              className="rounded-l-none"
            >
              <ZoomIn size={16} />
              <span className="sr-only">Zoom In</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'weekly'
                  ? 'bg-mood-purple text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('weekly')}
            >
              Weekly
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'daily'
                  ? 'bg-mood-purple text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('daily')}
            >
              Daily
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'hourly'
                  ? 'bg-mood-purple text-white'
                  : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setView('hourly')}
            >
              Hourly
            </button>
          </div>
        </div>
      </div>

      <div className="h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          {view === 'weekly' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => MOOD_LEVELS[v - 1]?.split(' ')[0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="mood"
                stroke="#9b87f5"
                strokeWidth={3}
                dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#6E59A5', r: 6 }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey={dataKey} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis
                domain={[1, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => MOOD_LEVELS[v - 1]?.split(' ')[0]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#9b87f5"
                fill="url(#colorMood)"
                strokeWidth={3}
                dot={{ fill: '#7E69AB', strokeWidth: 2, r: 4 }}
                activeDot={{ fill: '#6E59A5', r: 6 }}
              />
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E5DEFF" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {(view === 'daily' || view === 'hourly') && (
        <div className="mt-3 text-xs text-center text-muted-foreground">
          {view === 'hourly'
            ? 'Hourly zoom view (exact entries)'
            : 'Daily view (2-hour intervals)'}
        </div>
      )}
    </div>
  );
}

