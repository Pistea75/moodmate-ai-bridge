
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
  const { data: linkData } = await supabase
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
  const { data: patientProfile } = await supabase
    .from("profiles")
    .select("referral_code")
    .eq("id", patientId)
    .maybeSingle();

  if (!patientProfile || !patientProfile.referral_code) {
    console.error("No referral code found for patient");
    throw new Error("No referral code found. Please connect to a clinician first.");
  }

  const referralCode = patientProfile.referral_code.trim().toUpperCase();
  console.log("Found referral code in profile:", referralCode);

  // Step 4: Get clinician by referral code - CASE INSENSITIVE SEARCH
  console.log("Finding clinician with referral code:", referralCode);
  
  // Try with exact match first
  const { data: clinician } = await supabase
    .from("profiles")
    .select("id, first_name, last_name")
    .eq("role", "clinician")
    .ilike("referral_code", referralCode) // Using ilike for case-insensitive matching
    .maybeSingle();

  if (clinician?.id) {
    console.log("Found clinician by referral code:", clinician.id, clinician.first_name, clinician.last_name);
    
    // Update the user metadata with the clinician connection for faster lookup later
    await supabase.auth.updateUser({
      data: {
        connected_clinician_id: clinician.id,
        connected_clinician_name: `${clinician.first_name || ''} ${clinician.last_name || ''}`.trim()
      }
    });
    
    return { clinicianId: clinician.id };
  }
  
  console.error("No clinician found with referral code:", referralCode);
  throw new Error("No clinician found with referral code. Please check your referral code or contact your clinician.");
}
