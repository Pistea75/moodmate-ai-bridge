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

// Generate GMT-style time zone options
export const getCommonTimezones = () => {
  // Define common GMT offsets with descriptive names
  return [
    { value: "GMT+0", label: "GMT+0000 (London, Lisbon)" },
    { value: "GMT-5", label: "GMT-0500 (New York, Eastern Time)" },
    { value: "GMT-6", label: "GMT-0600 (Chicago, Central Time)" },
    { value: "GMT-7", label: "GMT-0700 (Denver, Mountain Time)" },
    { value: "GMT-8", label: "GMT-0800 (Los Angeles, Pacific Time)" },
    { value: "GMT+1", label: "GMT+0100 (Berlin, Paris, Rome)" },
    { value: "GMT+2", label: "GMT+0200 (Athens, Cairo)" },
    { value: "GMT+3", label: "GMT+0300 (Moscow, Istanbul)" },
    { value: "GMT+5:30", label: "GMT+0530 (New Delhi, Mumbai)" },
    { value: "GMT+8", label: "GMT+0800 (Beijing, Singapore)" },
    { value: "GMT+9", label: "GMT+0900 (Tokyo, Seoul)" },
    { value: "GMT+10", label: "GMT+1000 (Sydney, Melbourne)" },
    { value: "GMT+12", label: "GMT+1200 (Auckland, Fiji)" },
  ];
};

export const getCurrentTimezone = () => {
  // Get the local timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();
  // Convert to hours (timezone offsets are inverted, so we negate)
  const offsetHours = -offsetMinutes / 60;
  
  // Format as GMT+/-XX:XX
  const sign = offsetHours >= 0 ? '+' : '-';
  const absHours = Math.abs(offsetHours);
  const hours = Math.floor(absHours);
  const minutes = Math.round((absHours - hours) * 60);
  
  if (minutes === 0) {
    return `GMT${sign}${hours}`;
  } else {
    return `GMT${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }
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
