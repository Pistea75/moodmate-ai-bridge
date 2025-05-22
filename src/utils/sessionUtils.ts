
import { supabase } from "@/integrations/supabase/client";
import { getCurrentTimezone, getCommonTimezones } from "./timeUtils";
import { toast } from "sonner";

/**
 * Deletes a therapy session
 * @param sessionId - ID of the session to delete
 * @returns Object with success status
 */
export const deleteSession = async (sessionId: string) => {
  if (!sessionId) {
    toast.error("Session ID is required");
    throw new Error("Session ID is required");
  }
  
  console.log("Attempting to delete session with ID:", sessionId);
  
  try {
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);
      
    if (error) {
      console.error("Error deleting session:", error);
      toast.error(`Failed to delete session: ${error.message}`);
      throw new Error(`Error deleting session: ${error.message}`);
    }
    
    console.log("Session deleted successfully:", sessionId);
    toast.success("Session deleted successfully");
    return { success: true };
  } catch (err: any) {
    console.error("Unexpected error deleting session:", err);
    toast.error(err.message || "Failed to delete session");
    throw err;
  }
};

/**
 * Generate time slots for session scheduling
 * @returns Array of time slots in "HH:MM" format
 */
export const generateTimeSlots = () => {
  const slots = [];
  // Generate time slots for all 24 hours
  for (let hour = 0; hour < 24; hour++) {
    const hourStr = hour.toString().padStart(2, '0');
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedMinute = minute.toString().padStart(2, '0');
      slots.push(`${hourStr}:${formattedMinute}`);
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
