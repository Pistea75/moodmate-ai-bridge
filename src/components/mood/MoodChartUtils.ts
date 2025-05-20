
import { MoodEntry } from '@/hooks/useMoodEntries';
import { ViewMode } from './MoodChartConstants';

export interface ChartData {
  label: string;
  mood: number | null;
}

export const normalizeMood = (score: number) =>
  Math.max(1, Math.min(5, Math.ceil(score / 2)));

export const parseEntries = (entries: MoodEntry[], view: ViewMode): ChartData[] => {
  if (view === 'weekly') {
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
