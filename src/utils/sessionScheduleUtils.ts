
/**
 * Utility functions for scheduling sessions with timezone support
 */
import { supabase } from "@/integrations/supabase/client";
import { resolvePatientSessionDetails } from "./clinicianPatientUtils";
import { 
  parseGMTOffset, 
  validateScheduleParams, 
  validateUserIds, 
  isValidUUID 
} from "./sessionValidationUtils";

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
 * Schedules a new therapy session with proper timezone handling
 */
export const scheduleSession = async ({ 
  date, 
  time, 
  patientId, 
  clinicianId,
  timezone,
  isPatientView 
}: ScheduleSessionParams) => {
  // Validate input parameters
  const { inputDate, hours, minutes } = validateScheduleParams(date, time, timezone);
  
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
  
  // For patient view, we need to find the clinician based on referral code
  if (isPatientView) {
    try {
      const result = await resolvePatientSessionDetails(user.id);
      finalClinicianId = result.clinicianId;
      finalPatientId = user.id;
    } catch (error) {
      throw new Error("No clinician found with referral code. Please connect to a clinician first.");
    }
  }
  
  // Validate user IDs
  validateUserIds(finalClinicianId, finalPatientId);
  
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
  
  // Create the payload with validated UUIDs
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

  const { error } = await supabase.from("sessions").insert(payload);
  
  if (error) {
    console.error("❌ Database error creating session:", error);
    throw new Error(`Error scheduling session: ${error.message}`);
  }
  
  console.log("✅ Session scheduled successfully");
  return { success: true };
};
