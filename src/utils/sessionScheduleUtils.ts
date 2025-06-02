
/**
 * Utility functions for scheduling sessions with timezone support
 */
import { supabase } from "@/integrations/supabase/client";
import { resolvePatientSessionDetails } from "./clinicianPatientUtils";

/**
 * Interface for session scheduling parameters
 */
export interface ScheduleSessionParams {
  date: string;  // ISO string
  time: string;
  patientId?: string;
  clinicianId?: string;
  timezone: string;
  isPatientView: boolean;
}

/**
 * Interface for session insert payload
 */
interface SessionInsertPayload {
  scheduled_time: string;
  duration_minutes: number;
  timezone: string;
  status: string;
  patient_id?: string;
  clinician_id?: string;
}

/**
 * Validates if a string is a valid UUID format
 */
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

/**
 * Converts GMT offset string to minutes
 */
const parseGMTOffset = (timezone: string): number => {
  const match = timezone.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/);
  if (!match) return 0;
  
  const sign = match[1] === '+' ? 1 : -1;
  const hours = parseInt(match[2], 10);
  const minutes = parseInt(match[3] || '0', 10);
  
  return sign * (hours * 60 + minutes);
};

/**
 * Schedules a new therapy session with proper timezone handling
 * @param params - Session parameters
 * @returns Object with success status
 */
export const scheduleSession = async ({ 
  date, 
  time, 
  patientId, 
  clinicianId,
  timezone,
  isPatientView 
}: ScheduleSessionParams) => {
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
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  let finalClinicianId = clinicianId;
  let finalPatientId = patientId;
  
  console.log("🔍 Initial IDs received:");
  console.log("  - patientId:", patientId, "Type:", typeof patientId);
  console.log("  - clinicianId:", clinicianId, "Type:", typeof clinicianId);
  console.log("  - isPatientView:", isPatientView);
  
  // For patient view, we need to find the clinician based on referral code
  if (isPatientView) {
    console.log("Patient view detected, resolving clinician ID...");
    try {
      const result = await resolvePatientSessionDetails(user.id);
      finalClinicianId = result.clinicianId;
      finalPatientId = user.id;
      console.log("Resolved clinician ID:", finalClinicianId);
    } catch (error) {
      console.error("Error resolving clinician:", error);
      throw new Error("No clinician found with referral code. Please connect to a clinician first.");
    }
  }
  
  console.log("🔍 Final IDs before validation:");
  console.log("  - finalPatientId:", finalPatientId, "Type:", typeof finalPatientId);
  console.log("  - finalClinicianId:", finalClinicianId, "Type:", typeof finalClinicianId);
  
  // Strict validation for UUID values - reject invalid values
  if (!finalClinicianId || 
      finalClinicianId.trim() === '' || 
      finalClinicianId === 'undefined' || 
      finalClinicianId === 'null' ||
      !isValidUUID(finalClinicianId)) {
    console.error("❌ Invalid clinician ID:", finalClinicianId);
    throw new Error("Missing or invalid clinician information");
  }
  
  if (!finalPatientId || 
      finalPatientId.trim() === '' || 
      finalPatientId === 'undefined' || 
      finalPatientId === 'null' ||
      !isValidUUID(finalPatientId)) {
    console.error("❌ Invalid patient ID:", finalPatientId);
    throw new Error("Missing or invalid patient information");
  }
  
  console.log("✅ UUID validation passed");
  console.log("Final validation - Clinician ID:", finalClinicianId);
  console.log("Final validation - Patient ID:", finalPatientId);
  
  // Check for conflicts using the updated database structure
  const { data: conflictData, error: conflictError } = await supabase
    .from("sessions")
    .select("*")
    .eq("clinician_id", finalClinicianId)
    .eq("scheduled_time", utcDateTime.toISOString())
    .maybeSingle();
    
  if (conflictError) {
    console.error("Error checking for conflicts:", conflictError);
  }
  
  if (conflictData) {
    throw new Error("This time slot is already booked. Please select another time.");
  }
  
  // Create the payload with validated UUIDs - only include valid IDs
  const payload: SessionInsertPayload = {
    scheduled_time: utcDateTime.toISOString(),
    duration_minutes: 50,
    timezone,
    status: 'scheduled',
  };

  // Only add IDs if they are valid UUIDs
  if (finalPatientId && isValidUUID(finalPatientId)) {
    payload.patient_id = finalPatientId;
  }

  if (finalClinicianId && isValidUUID(finalClinicianId)) {
    payload.clinician_id = finalClinicianId;
  }

  console.log("🧠 Final validated payload:", payload);

  const { error } = await supabase.from("sessions").insert(payload);
  
  if (error) {
    console.error("❌ Database error creating session:", error);
    throw new Error(`Error scheduling session: ${error.message}`);
  }
  
  console.log("✅ Session scheduled successfully");
  return { success: true };
};
