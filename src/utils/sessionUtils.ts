
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

// Generate all 24 standard GMT time zones
export const getCommonTimezones = () => {
  const timezones = [];
  
  // Add all 24 standard GMT time zones
  for (let offset = -12; offset <= 12; offset++) {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const label = `GMT${sign}${absOffset}`;
    const value = `GMT${sign}${absOffset}`;
    
    // Add major city references for common time zones
    let cities = "";
    if (offset === 0) cities = " (London, UTC)";
    else if (offset === -5) cities = " (New York, Eastern Time)";
    else if (offset === -6) cities = " (Chicago, Central Time)";
    else if (offset === -7) cities = " (Denver, Mountain Time)";
    else if (offset === -8) cities = " (Los Angeles, Pacific Time)";
    else if (offset === +1) cities = " (Berlin, Paris, Rome)";
    else if (offset === +2) cities = " (Athens, Cairo)";
    else if (offset === +3) cities = " (Moscow, Istanbul)";
    else if (offset === +8) cities = " (Beijing, Singapore)";
    else if (offset === +9) cities = " (Tokyo, Seoul)";
    else if (offset === +10) cities = " (Sydney)";
    
    timezones.push({ value, label: label + cities });
  }

  // Add GMT+5:30 for India
  timezones.push({ value: "GMT+5:30", label: "GMT+5:30 (New Delhi, Mumbai)" });
  
  // Add GMT+3:30 for Iran
  timezones.push({ value: "GMT+3:30", label: "GMT+3:30 (Tehran)" });
  
  // Add GMT+4:30 for Afghanistan
  timezones.push({ value: "GMT+4:30", label: "GMT+4:30 (Kabul)" });
  
  // Add GMT+6:30 for Myanmar
  timezones.push({ value: "GMT+6:30", label: "GMT+6:30 (Yangon)" });
  
  // Add GMT+8:45 for Australia (Eucla)
  timezones.push({ value: "GMT+8:45", label: "GMT+8:45 (Eucla)" });
  
  // Add GMT+9:30 for Australia (Darwin)
  timezones.push({ value: "GMT+9:30", label: "GMT+9:30 (Darwin, Adelaide)" });
  
  // Add GMT+10:30 for Australia (Lord Howe Island)
  timezones.push({ value: "GMT+10:30", label: "GMT+10:30 (Lord Howe Island)" });
  
  // Add GMT+11:30 for Norfolk Island
  timezones.push({ value: "GMT+11:30", label: "GMT+11:30 (Norfolk Island)" });
  
  // Add GMT+12:45 for New Zealand (Chatham Islands)
  timezones.push({ value: "GMT+12:45", label: "GMT+12:45 (Chatham Islands)" });
  
  // Sort by offset
  return timezones.sort((a, b) => {
    const offsetA = parseFloat(a.value.replace("GMT", "").replace(":", "."));
    const offsetB = parseFloat(b.value.replace("GMT", "").replace(":", "."));
    return offsetA - offsetB;
  });
};

export const getCurrentTimezone = () => {
  // Get the local timezone offset in minutes
  const offsetMinutes = new Date().getTimezoneOffset();
  // Convert to hours (timezone offsets are inverted, so we negate)
  const offsetHours = -offsetMinutes / 60;
  
  // Format as GMT+/-XX
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
  date: string;  // Changed from Date to string to accept ISO string
  time: string;
  patientId?: string;
  clinicianId?: string;
  timezone: string;
  isPatientView: boolean;
}) => {
  if (!date || !time) {
    throw new Error("Missing required fields");
  }
  
  // Parse the ISO string back to a Date object
  const scheduledTime = new Date(date);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Could not get current user");
  }
  
  let finalClinicianId = clinicianId || user.id;
  let finalPatientId = patientId;
  
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

// Helper function to resolve patient-clinician relationship
async function resolvePatientSessionDetails(patientId: string) {
  console.log("Resolving patient-clinician relationship for patient:", patientId);
  
  // Step 1: Check user metadata first (faster and more direct)
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError) {
    console.error("Error getting user:", userError);
    throw new Error("Could not get user information");
  }
  
  console.log("User metadata:", user?.user_metadata);
  
  // If the connected_clinician_id is in user metadata, use it
  if (user?.user_metadata?.connected_clinician_id) {
    console.log("Found clinician ID in user metadata:", user.user_metadata.connected_clinician_id);
    return { clinicianId: user.user_metadata.connected_clinician_id };
  }
  
  // Step 2: Check the patient_clinician_links table for a direct relationship
  console.log("Checking patient_clinician_links table for relationship...");
  const { data: linkData, error: linkError } = await supabase
    .from("patient_clinician_links")
    .select("clinician_id")
    .eq("patient_id", patientId)
    .maybeSingle();
  
  if (linkData?.clinician_id) {
    console.log("Found clinician ID in patient_clinician_links:", linkData.clinician_id);
    return { clinicianId: linkData.clinician_id };
  }
  
  // Step 3: If not in metadata or links, check the profiles table
  console.log("Checking profiles table for referral code...");
  const { data: patientProfile, error: profileError } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", patientId)
    .maybeSingle();

  if (!patientProfile || profileError) {
    console.error("Error getting patient profile:", profileError);
    throw new Error("Could not get patient's referral code");
  }

  if (!patientProfile.referral_code) {
    console.error("No referral code found for patient");
    throw new Error("No referral code found. Please connect to a clinician first.");
  }

  // Step 4: Get clinician by referral code
  console.log("Finding clinician with referral code:", patientProfile.referral_code);
  const { data: clinician, error: clinicianError } = await supabase
    .from("profiles")
    .select("id")
    .eq("referral_code", patientProfile.referral_code)
    .eq("role", "clinician")
    .maybeSingle();

  if (!clinician || clinicianError) {
    console.error("Error finding clinician:", clinicianError);
    throw new Error("No clinician found with referral code");
  }

  console.log("Found clinician by referral code:", clinician.id);
  return { clinicianId: clinician.id };
}
