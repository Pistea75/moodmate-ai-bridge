
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

/**
 * Deletes a therapy session
 * @param sessionId - ID of the session to delete
 * @returns Object with success status
 */
export const deleteSession = async (sessionId: string) => {
  if (!sessionId) {
    throw new Error("Session ID is required");
  }
  
  console.log("Attempting to delete session with ID:", sessionId);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  // Check if user has permission to delete this session (either patient or clinician)
  const { data: sessionData, error: sessionError } = await supabase
    .from("sessions")
    .select("patient_id, clinician_id")
    .eq("id", sessionId)
    .single();
    
  if (sessionError) {
    console.error("Error fetching session:", sessionError);
    throw new Error(`Error fetching session: ${sessionError.message}`);
  }
  
  if (!sessionData) {
    throw new Error("Session not found");
  }
  
  // Verify the user is either the patient or clinician for this session
  if (sessionData.patient_id !== user.id && sessionData.clinician_id !== user.id) {
    throw new Error("You don't have permission to delete this session");
  }
  
  // Delete the session
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);
    
  if (error) {
    console.error("Error deleting session:", error);
    throw new Error(`Error deleting session: ${error.message}`);
  }
  
  console.log("Session deleted successfully:", sessionId);
  return { success: true };
};
