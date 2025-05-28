
import { subDays, format, isAfter, isBefore, startOfDay, endOfDay } from 'date-fns';

export interface DateRange {
  start: Date;
  end: Date;
}

export function getLastSevenDays(): DateRange {
  const end = new Date();
  const start = subDays(end, 6); // Last 7 days including today
  return { 
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

export function getLastThirtyDays(): DateRange {
  const end = new Date();
  const start = subDays(end, 29); // Last 30 days including today
  return { 
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

export function formatDateRangeLabel(start: Date, end: Date): string {
  const today = new Date();
  const isToday = end.toDateString() === today.toDateString();
  
  if (isToday) {
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === 6) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d')} (Week)`;
    }
    if (daysDiff === 29) {
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d')} (Month)`;
    }
  }
  
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`;
}

export function isDayInRange(date: Date, range: DateRange): boolean {
  return isAfter(date, range.start) && isBefore(date, range.end);
}

export function generateDateLabels(range: DateRange, viewMode: 'daily' | 'weekly'): string[] {
  if (viewMode === 'daily') {
    return ['Morning', 'Afternoon', 'Evening', 'Night'];
  }
  
  // For weekly view, generate day labels for the range
  const labels: string[] = [];
  const daysDiff = Math.floor((range.end.getTime() - range.start.getTime()) / (1000 * 60 * 60 * 24));
  
  for (let i = 0; i <= daysDiff; i++) {
    const date = new Date(range.start);
    date.setDate(date.getDate() + i);
    labels.push(format(date, 'EEE')); // Short day name like 'Mon', 'Tue'
  }
  
  return labels;
}
