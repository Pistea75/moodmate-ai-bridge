
import { MoodEntry } from '@/hooks/useMoodEntries';
import { ViewMode } from './MoodChartConstants';
import { isHighRiskMood } from '@/lib/utils/alertTriggers';

export interface ChartData {
  label: string;
  mood: number | null;
  flagged?: boolean;
}

export const normalizeMood = (score: number) =>
  Math.max(1, Math.min(5, Math.ceil(score / 2)));

export const parseEntries = (entries: MoodEntry[], view: ViewMode): ChartData[] => {
  if (view === 'weekly') {
    const grouped: Record<number, { moods: number[], flagged: boolean }> = {};

    entries.forEach((entry) => {
      const date = new Date(entry.created_at);
      const dayIndex = date.getDay();
      
      if (!grouped[dayIndex]) grouped[dayIndex] = { moods: [], flagged: false };
      grouped[dayIndex].moods.push(normalizeMood(entry.mood_score));
      
      // Check if this entry is high risk and update the flag
      const isHighRisk = isHighRiskMood(entry.mood_score, entry.triggers);
      grouped[dayIndex].flagged ||= isHighRisk;
    });

    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return Array.from({ length: 7 }, (_, i) => {
      const group = grouped[i] || { moods: [], flagged: false };
      const moods = group.moods;
      
      const average =
        moods.length > 0
          ? Math.round(moods.reduce((sum, val) => sum + val, 0) / moods.length)
          : null;

      return {
        label: weekLabels[i],
        mood: average,
        flagged: group.flagged
      };
    });
  }

  // Daily view
  const timeMap: Record<string, { moods: number[], flagged: boolean }> = {};

  entries.forEach((entry) => {
    const date = new Date(entry.created_at);
    const time = date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
    
    if (!timeMap[time]) timeMap[time] = { moods: [], flagged: false };
    timeMap[time].moods.push(normalizeMood(entry.mood_score));
    
    // Check if this entry is high risk and update the flag
    const isHighRisk = isHighRiskMood(entry.mood_score, entry.triggers);
    timeMap[time].flagged ||= isHighRisk;
  });

  return Object.entries(timeMap).map(([label, group]) => ({
    label,
    mood: Math.round(group.moods.reduce((sum, m) => sum + m, 0) / group.moods.length),
    flagged: group.flagged
  }));
};
