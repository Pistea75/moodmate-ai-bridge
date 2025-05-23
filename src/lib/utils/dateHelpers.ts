
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

export function getStartOfWeek(date = new Date()): string {
  // Clone the date to avoid modifying the original
  const d = new Date(date);
  // Set to the start of the current week (Sunday)
  d.setDate(d.getDate() - d.getDay());
  // Set to midnight (start of day)
  d.setHours(0, 0, 0, 0);
  
  // Return ISO string for database query
  return d.toISOString();
}

export function getFormattedDateRange(startDate: Date | null, endDate: Date | null): string {
  if (!startDate || !endDate) return 'All time';
  
  const formatStr = 'MMM d, yyyy';
  return `${format(startDate, formatStr)} - ${format(endDate, formatStr)}`;
}

export function getLastSevenDays(): { start: Date, end: Date } {
  const end = new Date(); // Today
  const start = subDays(end, 7);
  return { 
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

export function ensureDateFormat(date: Date | null): string | null {
  if (!date) return null;
  return date.toISOString();
}

export function formatDateForDisplay(dateString: string): string {
  try {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy h:mm a');
  } catch (e) {
    return dateString;
  }
}
