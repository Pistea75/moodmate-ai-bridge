import { supabase } from '@/integrations/supabase/client';

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
    throw new Error('Could not load user profile');
  }

  return profile;
}
