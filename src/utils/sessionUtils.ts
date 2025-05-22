
import { supabase } from "@/integrations/supabase/client";
import { getCurrentTimezone, getCommonTimezones } from "./timeUtils";

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

/**
 * Generate time slots for session scheduling
 * @returns Array of time slots in "HH:MM" format
 */
export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 9; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return slots;
};

// Re-export the necessary functions from timeUtils
export { getCurrentTimezone, getCommonTimezones };

// Import and re-export scheduleSession from sessionScheduleUtils
import { scheduleSession, type ScheduleSessionParams } from "./sessionScheduleUtils";
export { scheduleSession, type ScheduleSessionParams };

// Re-export resolvePatientSessionDetails from clinicianPatientUtils
import { resolvePatientSessionDetails } from "./clinicianPatientUtils";
export { resolvePatientSessionDetails };
