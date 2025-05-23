
import { format, parseISO, differenceInCalendarDays, isAfter, subDays } from 'date-fns';

export interface MoodEntry {
  mood_score: number;
  created_at: string;
  triggers?: string[];
}

export function detectMoodDrop(entries: MoodEntry[]): string | null {
  if (!entries || entries.length < 2) return null;
  
  const sorted = [...entries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    const drop = prev.mood_score - curr.mood_score;
    if (drop >= 5) {
      return `Sudden mood drop: From ${prev.mood_score} → ${curr.mood_score} on ${format(
        new Date(curr.created_at),
        'MMM dd'
      )}`;
    }
  }

  return null;
}

export function detectLowMoodStreak(entries: MoodEntry[], threshold = 3, streakLength = 3): string | null {
  if (!entries || entries.length < streakLength) return null;

  const sorted = [...entries].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  let streakCount = 0;
  let lastDate: Date | null = null;

  for (const entry of sorted) {
    const currentDate = parseISO(entry.created_at);
    const mood = entry.mood_score;

    if (mood <= threshold) {
      if (!lastDate || differenceInCalendarDays(currentDate, lastDate) === 1) {
        streakCount += 1;
      } else {
        streakCount = 1;
      }
      lastDate = currentDate;

      if (streakCount >= streakLength) {
        return `3+ day streak of low mood detected (≤ ${threshold}).`;
      }
    } else {
      streakCount = 0;
      lastDate = null;
    }
  }

  return null;
}

export function detectTriggerFrequency(entries: MoodEntry[], threshold = 3): string | null {
  const recentEntries = entries.filter(entry =>
    isAfter(new Date(entry.created_at), subDays(new Date(), 7))
  );

  const triggerCounts: Record<string, number> = {};

  for (const entry of recentEntries) {
    const triggers: string[] = Array.isArray(entry.triggers) ? entry.triggers : [];

    for (const raw of triggers) {
      const trigger = raw.trim().toLowerCase();
      triggerCounts[trigger] = (triggerCounts[trigger] || 0) + 1;
    }
  }

  const repeated = Object.entries(triggerCounts).filter(([_, count]) => count >= threshold);

  if (repeated.length > 0) {
    return repeated
      .map(([trigger, count]) => `Trigger "${trigger}" reported ${count}x this week`)
      .join('; ');
  }

  return null;
}
