
/**
 * Validation utilities for session scheduling
 */

/**
 * Validates if a string is a valid UUID format
 */
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Converts GMT offset string to minutes
 */
export const parseGMTOffset = (timezone: string): number => {
  const match = timezone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3] || '0', 10);
  
  return sign * (hours * 60 + minutes);
};

/**
 * Validates session scheduling parameters
 */
export const validateScheduleParams = (date: string, time: string, timezone: string) => {
  if (!date || !time || !timezone) {
    throw new Error("Missing required fields: date, time, or timezone");
  }
  
  // Parse the input date and time components
  const inputDate = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  
  // Validate the input date
  if (isNaN(inputDate.getTime())) {
    throw new Error("Invalid date provided");
  }
  
  // Validate time components
  if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time format");
  }
  
  return { inputDate, hours, minutes };
};

/**
 * Validates user IDs for session creation
 */
export const validateUserIds = (clinicianId?: string, patientId?: string) => {
  // Strict validation for UUID values - reject invalid values
  if (!clinicianId || 
      clinicianId.trim() === '' || 
      clinicianId === 'undefined' || 
      clinicianId === 'null' ||
      !isValidUUID(clinicianId)) {
    console.error("❌ Invalid clinician ID:", clinicianId);
    throw new Error("Missing or invalid clinician information");
  }
  
  if (!patientId || 
      patientId.trim() === '' || 
      patientId === 'undefined' || 
      patientId === 'null' ||
      !isValidUUID(patientId)) {
    console.error("❌ Invalid patient ID:", patientId);
    throw new Error("Missing or invalid patient information");
  }
};
