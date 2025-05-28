
import { eachDayOfInterval, format, startOfDay, endOfDay } from 'date-fns';

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
export function normalizeMood(score: number): number {
  return Math.max(1, Math.min(5, Math.ceil(score / 2)));
}

// Function to determine if a mood entry is high risk
function isHighRiskMood(score: number, triggers: string[] | null): boolean {
  if (score <= 3) {
    return true;
  }

  if (triggers && triggers.length > 0) {
    const riskyTriggers = ['stress', 'anxiety', 'panic', 'overwhelmed'];
    return triggers.some(trigger => 
      riskyTriggers.includes(trigger.toLowerCase())
    );
  }

  return false;
}

// Function to generate dynamic date range for chart
export function generateDateRange(startDate: Date, endDate: Date): Date[] {
  return eachDayOfInterval({ 
    start: startOfDay(startDate), 
    end: endOfDay(endDate) 
  });
}

// Function to parse mood entries into chart data with dynamic date range
export function parseEntries(entries: MoodEntry[], view: ViewMode, dateRange?: { start: Date; end: Date }): ChartData[] {
  if (view === 'daily') {
    // Group entries by time of day (Morning, Afternoon, Evening, Night)
    const grouped: Record<string, { 
      sum: number; 
      count: number; 
      flagged: boolean; 
      notes: string[] 
    }> = {
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
      notes: data.notes.join(', ') || null,
    }));
  } else {
    // Weekly view with dynamic date range
    if (!dateRange) {
      // Fallback to default week view
      const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const grouped: Record<string, { 
        sum: number; 
        count: number; 
        flagged: boolean; 
        notes: string[] 
      }> = {};

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

      return daysOfWeek.map(day => ({
        label: day,
        mood: grouped[day] ? Math.round(grouped[day].sum / grouped[day].count) : null,
        flagged: grouped[day] ? grouped[day].flagged : false,
        notes: grouped[day] ? grouped[day].notes.join(', ') || null : null,
      }));
    }

    // Generate dynamic date range
    const dateInterval = generateDateRange(dateRange.start, dateRange.end);
    
    // Create a map for quick lookup of mood entries by date
    const entriesByDate = new Map<string, MoodEntry[]>();
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.created_at), 'yyyy-MM-dd');
      if (!entriesByDate.has(dateKey)) {
        entriesByDate.set(dateKey, []);
      }
      entriesByDate.get(dateKey)!.push(entry);
    });

    // Generate chart data for each day in the range
    return dateInterval.map(date => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const dayEntries = entriesByDate.get(dateKey) || [];
      
      // Determine label format based on range length
      const daysDiff = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
      const label = daysDiff <= 7 
        ? format(date, 'EEE')  // Short format for week view
        : format(date, 'MMM dd'); // Date format for longer ranges

      if (dayEntries.length === 0) {
        return {
          label,
          mood: null,
          flagged: false,
          notes: null,
        };
      }

      // Calculate average mood for the day
      const totalMood = dayEntries.reduce((sum, entry) => sum + normalizeMood(entry.mood_score), 0);
      const avgMood = Math.round(totalMood / dayEntries.length);
      
      // Check if any entry is flagged
      const isFlagged = dayEntries.some(entry => isHighRiskMood(entry.mood_score, entry.triggers));
      
      // Combine notes
      const notes = dayEntries
        .filter(entry => entry.notes)
        .map(entry => entry.notes)
        .join(', ') || null;

      return {
        label,
        mood: avgMood,
        flagged: isFlagged,
        notes,
      };
    });
  }
}
