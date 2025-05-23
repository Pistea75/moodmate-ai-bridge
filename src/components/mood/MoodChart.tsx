
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoodChartView } from './MoodChartView';
import { ChartData, parseEntries } from './MoodChartUtils';
import { ViewMode } from './MoodChartConstants';
import { MoodEntry } from '@/hooks/useMoodEntries';

interface MoodChartProps {
  patientId?: string;
}

export function MoodChart({ patientId }: MoodChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [view, setView] = useState<ViewMode>('weekly');
  const { toast } = useToast();

  const fetchMoodData = async () => {
    // If patient ID is provided, fetch that specific patient's data (for clinician view)
    // Otherwise, fetch the current user's data (for patient view)
    if (patientId) {
      const { data: entries, error } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at, triggers, notes')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching mood entries:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to load mood data',
          description: error.message,
        });
        return;
      }

      const parsed = parseEntries(entries as MoodEntry[] || [], view);
      setData(parsed);
      return;
    }

    // Default path - fetch current user's data
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'User not authenticated',
      });
      return;
    }

    const { data: entries, error } = await supabase
      .from('mood_entries')
      .select('mood_score, created_at, triggers, notes')
      .eq('patient_id', userData.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load mood data',
        description: error.message,
      });
      return;
    }

    const parsed = parseEntries(entries as MoodEntry[] || [], view);
    setData(parsed);
  };

  useEffect(() => {
    fetchMoodData();
  }, [view, patientId]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Mood Timeline</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('weekly')}
            className={view === 'weekly' ? 'bg-mood-purple text-white' : ''}
          >
            Weekly
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setView('daily')}
            className={view === 'daily' ? 'bg-mood-purple text-white' : ''}
          >
            Daily
          </Button>
        </div>
      </div>

      <MoodChartView data={data} view={view} />
    </div>
  );
}
