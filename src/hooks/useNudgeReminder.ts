
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useNudgeReminder() {
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    const checkLastMoodEntry = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from('mood_entries')
        .select('created_at')
        .eq('patient_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error) {
        const lastEntry = data?.created_at;
        const daysAgo = lastEntry
          ? Math.floor((Date.now() - new Date(lastEntry).getTime()) / (1000 * 60 * 60 * 24))
          : Infinity;

        if (daysAgo >= 3) {
          setShowNudge(true);
        }
      }
    };

    checkLastMoodEntry();
  }, []);

  return { showNudge, setShowNudge };
}
