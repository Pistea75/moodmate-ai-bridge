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

    // Get the clinician link first
    const { data: link, error: linkError } = await supabase
      .from('patient_clinician_links')
      .select('clinician_id')
      .eq('patient_id', user.id)
      .maybeSingle();

    console.log('📊 fetchAssignedClinician: Link result:', { link, linkError });

    if (linkError) {
      console.error('❌ fetchAssignedClinician: Error fetching link:', linkError);
      return null;
    }

    if (!link) {
      console.log('⚠️ fetchAssignedClinician: No clinician link found');
      return null;
    }

    // Now get the clinician profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, referral_code, email')
      .eq('id', link.clinician_id)
      .single();

    console.log('📊 fetchAssignedClinician: Profile result:', { profile, profileError });

    if (profileError) {
      console.error('❌ fetchAssignedClinician: Error fetching profile:', profileError);
      return null;
    }

    if (!profile) {
      console.log('⚠️ fetchAssignedClinician: No clinician profile found');
      return null;
    }

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
