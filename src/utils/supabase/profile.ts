import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch the authenticated user's profile securely.
 */
export async function fetchUserProfile() {
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, role, language')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Profile query failed:', profileError);
    throw new Error('Could not load profile');
  }

  return profile;
}
