
/**
 * Utility functions for scheduling sessions with timezone support
 */
import { supabase } from "@/integrations/supabase/client";
import { resolvePatientSessionDetails } from "./clinicianPatientUtils";
import { 
  validateScheduleParams, 
  validateUserIds, 
  isValidUUID 
} from "./sessionValidationUtils";
import { createUTCFromLocalDateTime } from "./sessionDateUtils";

/**
 * Interface for session scheduling parameters
 */
export interface ScheduleSessionParams {
  date: string;  // ISO string
  time: string;
  patientId?: string;
  clinicianId?: string;
  timezone: string;
  sessionType?: 'online' | 'in_person';
  recordingEnabled?: boolean;
  isPatientView: boolean;
  duration?: number;
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
  session_type?: string;
  recording_enabled?: boolean;
  recording_status?: string;
  transcription_status?: string;
  ai_report_status?: string;
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
  sessionType,
  recordingEnabled,
  isPatientView,
  duration = 60
}: ScheduleSessionParams) => {
  // Validate input parameters
  const { inputDate, hours, minutes } = validateScheduleParams(date, time, timezone);
  
  // Create UTC date from local date/time and timezone
  const utcDateTime = createUTCFromLocalDateTime(inputDate, hours, minutes, timezone);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  let finalClinicianId = clinicianId;
  let finalPatientId = patientId;
  
  // For patient view, we use the provided clinicianId and set patient to current user
  if (isPatientView) {
    if (!clinicianId) {
      throw new Error("No clinician selected. Please select your clinician.");
    }
    finalClinicianId = clinicianId;
    finalPatientId = user.id;
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
    duration_minutes: duration,
    timezone,
    status: 'scheduled',
    session_type: sessionType || 'in_person',
    recording_enabled: recordingEnabled || false,
    recording_status: 'none',
    transcription_status: 'none',
    ai_report_status: 'none'
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
