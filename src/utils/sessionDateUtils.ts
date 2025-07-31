
/**
 * Date utility functions for session scheduling
 */
import { createDateTimeInZone, fromZonedTime } from "@/lib/utils/timezoneUtils";
import { DateTime } from 'luxon';

/**
 * Creates a UTC date from local date/time components and timezone
 */
export const createUTCFromLocalDateTime = (
  inputDate: Date,
  hours: number,
  minutes: number,
  timezone: string
): Date => {
  try {
    console.log("📅 Creating session for:", inputDate.toDateString(), `${hours}:${minutes}`, "in", timezone);
    
    // Create date time in the specified timezone
    const localDateTime = createDateTimeInZone(
      inputDate.getFullYear(),
      inputDate.getMonth() + 1, // Luxon uses 1-based months
      inputDate.getDate(),
      hours,
      minutes,
      timezone
    );
    
    console.log("🌍 Local date/time in timezone:", localDateTime.toLocaleString());
    
    // Convert to UTC
    const utcDateTime = fromZonedTime(localDateTime, timezone);
    
    console.log("🌐 Converted to UTC:", utcDateTime.toISOString());
    
    return utcDateTime;
  } catch (error) {
    console.error("Error creating UTC from local date time:", error);
    throw new Error("Failed to create valid UTC date");
  }
};
