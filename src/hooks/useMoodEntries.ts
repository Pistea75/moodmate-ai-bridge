
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface MoodEntry {
  id: string;
  mood_score: number;
  notes?: string;
  triggers?: string[];
  created_at: string;
}

export function useMoodEntries() {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchMoodEntries = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from('mood_entries')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      setError(error.message);
      toast({
        variant: 'destructive',
        title: 'Error fetching mood logs',
        description: error.message,
      });
    } else {
      setMoods(data || []);
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  return {
    moods,
    loading,
    error,
    refetch: fetchMoodEntries
  };
}
