/**
 * Utility functions for scheduling sessions with timezone support
 */
import { supabase } from "@/integrations/supabase/client";
import { resolvePatientSessionDetails } from "./clinicianPatientUtils";
import { fromZonedTime } from "date-fns-tz";

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
  
  // Parse the local date and time
  const localDateTime = new Date(date);
  const [hours, minutes] = time.split(":").map(Number);
  
  // Set the time on the date
  localDateTime.setHours(hours, minutes, 0, 0);
  
  console.log("📅 Local date/time selected:", localDateTime.toLocaleString());
  console.log("🌍 Selected timezone:", timezone);
  
  // Convert the local time to UTC using the selected timezone
  const utcDateTime = fromZonedTime(localDateTime, timezone);
  
  console.log("🌐 Converted to UTC:", utcDateTime.toISOString());
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  let finalClinicianId = clinicianId;
  let finalPatientId = patientId || user.id;
  
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
  
  if (!finalClinicianId || !finalPatientId) {
    throw new Error("Missing clinician or patient information");
  }
  
  // Check for conflicts
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
  
  const { error } = await supabase.from("sessions").insert({
    patient_id: finalPatientId,
    clinician_id: finalClinicianId,
    scheduled_time: utcDateTime.toISOString(), // Store in UTC
    status: "scheduled",
    duration_minutes: 50,
    timezone: timezone, // Store the original timezone for display
  });
  
  if (error) {
    console.error("Error creating session:", error);
    throw new Error(`Error scheduling session: ${error.message}`);
  }
  
  console.log("✅ Session scheduled successfully");
  return { success: true };
};
