
import { MOOD_LABELS } from './MoodChartConstants';

export interface MoodEntry {
  mood_score: number;
  created_at: string;
  triggers: string[] | null;
  notes: string | null;
}

export interface ChartData {
  label: string;
  mood: number | null;
  flagged?: boolean;
  notes?: string | null;
}

export type ViewMode = 'weekly' | 'daily';

// Function to normalize mood score from 1-10 to 1-5
export function normalizeMood(score: number) {
  return Math.max(1, Math.min(5, Math.ceil(score / 2)));
}

// Function to determine if a mood entry is high risk
function isHighRiskMood(score: number, triggers: string[] | null): boolean {
  if (score <= 3) {
    return true;
  }

  if (triggers && triggers.length > 0) {
    const riskyTriggers = ['stress', 'anxiety', 'panic', 'overwhelmed'];
    return triggers.some(trigger => riskyTriggers.includes(trigger.toLowerCase()));
  }

  return false;
}

// Function to parse mood entries into chart data
export function parseEntries(entries: MoodEntry[], view: ViewMode): ChartData[] {
  if (view === 'daily') {
    // Group entries by time of day (Morning, Afternoon, Evening, Night)
    const grouped: { [key: string]: { sum: number; count: number; flagged: boolean; notes: string[] } } = {
      Morning: { sum: 0, count: 0, flagged: false, notes: [] },
      Afternoon: { sum: 0, count: 0, flagged: false, notes: [] },
      Evening: { sum: 0, count: 0, flagged: false, notes: [] },
      Night: { sum: 0, count: 0, flagged: false, notes: [] },
    };

    entries.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      let period: keyof typeof grouped;

      if (hour >= 6 && hour < 12) {
        period = 'Morning';
      } else if (hour >= 12 && hour < 18) {
        period = 'Afternoon';
      } else if (hour >= 18 && hour < 22) {
        period = 'Evening';
      } else {
        period = 'Night';
      }

      const normalizedMood = normalizeMood(entry.mood_score);
      grouped[period].sum += normalizedMood;
      grouped[period].count++;
      grouped[period].flagged = grouped[period].flagged || isHighRiskMood(entry.mood_score, entry.triggers);
      if (entry.notes) {
        grouped[period].notes.push(entry.notes);
      }
    });

    return Object.entries(grouped).map(([label, data]) => ({
      label,
      mood: data.count > 0 ? Math.round(data.sum / data.count) : null,
      flagged: data.flagged,
      notes: data.notes.join(', '),
    }));
  } else {
    // Group entries by day of the week
    const grouped: { [key: string]: { sum: number; count: number; flagged: boolean; notes: string[] } } = {};

    entries.forEach(entry => {
      const date = new Date(entry.created_at);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });

      if (!grouped[day]) {
        grouped[day] = { sum: 0, count: 0, flagged: false, notes: [] };
      }

      const normalizedMood = normalizeMood(entry.mood_score);
      grouped[day].sum += normalizedMood;
      grouped[day].count++;
      grouped[day].flagged = grouped[day].flagged || isHighRiskMood(entry.mood_score, entry.triggers);
      if (entry.notes) {
        grouped[day].notes.push(entry.notes);
      }
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return daysOfWeek.map(day => ({
      label: day,
      mood: grouped[day] ? Math.round(grouped[day].sum / grouped[day].count) : null,
      flagged: grouped[day] ? grouped[day].flagged : false,
      notes: grouped[day] ? grouped[day].notes.join(', ') : null,
    }));
  }
}
