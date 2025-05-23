
import { startOfDay, endOfDay, subDays } from "date-fns";

/**
 * Returns ISO string for the start of day
 */
export function getStartOfDayISO(date: Date): string {
  return startOfDay(date).toISOString();
}

/**
 * Returns ISO string for the end of day
 */
export function getEndOfDayISO(date: Date): string {
  return endOfDay(date).toISOString();
}

/**
 * Gets start and end date for last 7 days
 */
export function getLastSevenDays(): { start: Date; end: Date } {
  const end = new Date(); // Today
  const start = subDays(end, 7);
  return {
    start: startOfDay(start),
    end: endOfDay(end)
  };
}

/**
 * Validates if date filter dates are valid
 */
export function validateDateFilter(startDate: Date | null, endDate: Date | null): boolean {
  return !!(startDate && endDate);
}
