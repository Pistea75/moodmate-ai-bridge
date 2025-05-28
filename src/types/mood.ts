
export interface MoodEntry {
  id: string;
  mood_score: number;
  notes?: string;
  triggers?: string[];
  created_at: string;
  patient_id?: string;
}

export interface ChartData {
  label: string;
  mood: number | null;
  flagged?: boolean;
  notes?: string | null;
}

export type ViewMode = 'weekly' | 'daily';

export interface DateRangeFilter {
  start: Date | null;
  end: Date | null;
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  weekTrend: 'up' | 'down' | 'stable';
  flaggedEntries: number;
}
