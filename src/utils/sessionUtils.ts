
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

export const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 6; hour < 22; hour++) {
    const hourStr = hour.toString().padStart(2, "0");
    slots.push(`${hourStr}:00`);
    slots.push(`${hourStr}:30`);
  }
  return slots;
};

export const getCommonTimezones = () => [
  "America/New_York",
  "America/Chicago", 
  "America/Denver",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Paris",
  "Asia/Tokyo", 
  "Australia/Sydney",
  "Pacific/Auckland"
];

export const getCurrentTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const scheduleSession = async ({ 
  date, 
  time, 
  patientId, 
  clinicianId,
  timezone,
  isPatientView 
}: {
  date: Date;
  time: string;
  patientId?: string;
  clinicianId?: string;
  timezone: string;
  isPatientView: boolean;
}) => {
  if (!date || !time || (!isPatientView && !patientId)) {
    throw new Error("Missing required fields");
  }
  
  const [hours, minutes] = time.split(":").map(Number);
  const scheduledTime = new Date(date);
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  let finalClinicianId = clinicianId || user.id;
  let finalPatientId = patientId;
  
  // For patient view, we need to find the clinician based on referral code
  if (isPatientView) {
    const result = await resolvePatientSessionDetails(user.id);
    finalClinicianId = result.clinicianId;
    finalPatientId = user.id;
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
    throw new Error(`Error scheduling session: ${error.message}`);
  }
  
  return { success: true };
};

// Helper function to resolve patient-clinician relationship
async function resolvePatientSessionDetails(patientId: string) {
  // Step 1: find patient's referral_code
  const { data: patientProfile, error: profileError } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", patientId)
    .eq("role", "patient")
    .single();

  if (!patientProfile || profileError) {
    throw new Error("Could not get patient's referral code");
  }

  // Step 2: find the clinician with matching referral_code
  const { data: clinician, error: clinicianError } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", patientProfile.referral_code)
    .eq("role", "clinician")
    .single();

  if (!clinician || clinicianError) {
    throw new Error("No clinician found with referral code");
  }

  return { clinicianId: clinician.id };
}
