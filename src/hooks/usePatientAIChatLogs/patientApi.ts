
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches patient name from profile
 */
export async function fetchPatientName(patientId: string): Promise<string> {
  if (!patientId) return "Patient";
  
  try {
    console.log('Fetching patient name for ID:', patientId);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .filter('id', 'eq', patientId)
      .single();
    
    if (error) {
      console.error('Error fetching patient name:', error);
      return "Patient";
    }

    if (data) {
      return `${data.first_name || ''} ${data.last_name || ''}`.trim() || "Patient";
    }
    
    return "Patient";
  } catch (err) {
    console.error('Error in fetchPatientName:', err);
    return "Patient";
  }
}
