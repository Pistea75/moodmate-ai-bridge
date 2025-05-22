
/**
 * Utility functions for scheduling sessions
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
 * Schedules a new therapy session
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
  if (!date || !time) {
    throw new Error("Missing required fields");
  }
  
  // Parse the ISO string back to a Date object
  // This is already in the local timezone from the form
  const scheduledTime = new Date(date);
  console.log("📆 Parsed scheduled time:", scheduledTime.toLocaleString());
  console.log("⏰ Time string from form:", time);
  console.log("🌐 User selected timezone:", timezone);
  
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
  
  const { error } = await supabase.from("sessions").insert({
    patient_id: finalPatientId,
    clinician_id: finalClinicianId,
    scheduled_time: scheduledTime.toISOString(),
    status: "scheduled",
    duration_minutes: 50,
    timezone: timezone,
  });
  
  if (error) {
    console.error("Error creating session:", error);
    throw new Error(`Error scheduling session: ${error.message}`);
  }
  
  return { success: true };
};
