
import { startOfDay, endOfDay, subDays } from "date-fns";

/**
 * Returns ISO string for the start of day in UTC
 */
export function getStartOfDayISO(date: Date): string {
  // Ensure we're setting to midnight in UTC
  const utcDate = new Date(date);
  utcDate.setUTCHours(0, 0, 0, 0);
  return utcDate.toISOString();
}

/**
 * Returns ISO string for the end of day in UTC
 */
export function getEndOfDayISO(date: Date): string {
  // Set hours to 23:59:59.999 in UTC to include the entire day
  const utcDate = new Date(date);
  utcDate.setUTCHours(23, 59, 59, 999);
  return utcDate.toISOString();
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
