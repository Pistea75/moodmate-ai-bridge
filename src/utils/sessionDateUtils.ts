
/**
 * Date utility functions for session scheduling
 */
import { parseGMTOffset } from "./sessionValidationUtils";

/**
 * Creates a UTC date from local date/time components and timezone
 */
export const createUTCFromLocalDateTime = (
  inputDate: Date,
  hours: number,
  minutes: number,
  timezone: string
): Date => {
  // Create local date with the specified time
  const localDateTime = new Date(
    inputDate.getFullYear(),
    inputDate.getMonth(),
    inputDate.getDate(),
    hours,
    minutes,
    0,
    0
  );
  
  console.log("📅 Local date/time constructed:", localDateTime.toLocaleString());
  console.log("🌍 Selected timezone:", timezone);
  
  // Convert to UTC based on the selected timezone
  const timezoneOffsetMinutes = parseGMTOffset(timezone);
  const utcDateTime = new Date(localDateTime.getTime() - (timezoneOffsetMinutes * 60 * 1000));
  
  // Validate the final UTC date
  if (isNaN(utcDateTime.getTime())) {
    throw new Error("Failed to create valid UTC date");
  }
  
  console.log("🌐 Converted to UTC:", utcDateTime.toISOString());
  
  return utcDateTime;
};
