
/**
 * Utility functions for managing clinician-patient relationships
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves the clinician ID for a patient based on various data sources
 * @param patientId - The patient's user ID
 * @returns Object containing the resolved clinician ID
 */
export async function resolvePatientSessionDetails(patientId: string) {
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
