
import { format } from 'date-fns';

export interface MoodEntry {
  mood_score: number;
  created_at: string;
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
