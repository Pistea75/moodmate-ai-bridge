import { supabase } from '@/integrations/supabase/client';

export interface ClinicianInfo {
  id: string;
  first_name: string;
  last_name: string;
  referral_code?: string;
  email?: string;
}

/**
 * Fetch the clinician assigned to the current authenticated patient.
 * Uses a JOIN query to bypass RLS issues with direct profile queries.
 */
export async function fetchAssignedClinician(): Promise<ClinicianInfo | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ fetchAssignedClinician: No user found');
      return null;
    }

    console.log('✅ fetchAssignedClinician: Fetching clinician for patient:', user.id);

    // Use JOIN to get clinician profile directly with patient_clinician_links
    const { data: link, error: linkError } = await supabase
      .from('patient_clinician_links')
      .select(`
        clinician_id,
        profiles!patient_clinician_links_clinician_id_fkey (
          id,
          first_name,
          last_name,
          referral_code,
          email
        )
      `)
      .eq('patient_id', user.id)
      .maybeSingle();

    console.log('📊 fetchAssignedClinician: Query result:', { link, linkError });

    if (linkError) {
      console.error('❌ fetchAssignedClinician: Error fetching clinician:', linkError);
      return null;
    }

    if (!link || !link.profiles) {
      console.log('⚠️ fetchAssignedClinician: No clinician link found');
      return null;
    }

    const profile = link.profiles as any;
    console.log('✅ fetchAssignedClinician: Found clinician:', profile);

    return {
      id: profile.id,
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      referral_code: profile.referral_code || '',
      email: profile.email || ''
    };
  } catch (error) {
    console.error('❌ fetchAssignedClinician: Unexpected error:', error);
    return null;
  }
}

/**
 * Get the full name of a clinician
 */
export function getClinicianFullName(clinician: ClinicianInfo | null): string {
  if (!clinician) return '';
  return `${clinician.first_name} ${clinician.last_name}`.trim();
}

/**
 * Get the display name of a clinician (preferring last name)
 */
export function getClinicianDisplayName(clinician: ClinicianInfo | null): string {
  if (!clinician) return '';
  return clinician.last_name || clinician.first_name || '';
}
