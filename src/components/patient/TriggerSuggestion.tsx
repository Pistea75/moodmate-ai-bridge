
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getTriggerSuggestion } from '@/lib/utils/moodSuggestions';

export function TriggerSuggestion() {
  const { user } = useAuth();
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchLatestMood = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('mood_entries')
        .select('triggers')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data?.triggers) {
        const triggerSuggestion = getTriggerSuggestion(data.triggers);
        setSuggestion(triggerSuggestion);
      }
    };

    fetchLatestMood();
  }, [user?.id]);

  if (!suggestion) return null;

  return (
    <div className="bg-blue-100 border border-blue-300 text-blue-800 p-3 rounded-md mb-4 text-sm">
      💡 {suggestion}
    </div>
  );
}
