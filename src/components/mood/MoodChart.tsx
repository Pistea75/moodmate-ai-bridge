import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { MoodChartView } from './MoodChartView';
import { MoodChartDateFilter } from './MoodChartDateFilter';
import { ChartData, MoodEntry as MoodChartEntry, parseEntries, ViewMode } from './MoodChartUtils';
import { ViewMode as MoodViewMode } from './MoodChartConstants';
import { MoodEntry } from '@/hooks/useMoodEntries';

interface MoodChartProps {
  patientId?: string;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export function MoodChart({ patientId }: MoodChartProps) {
  const [data, setData] = useState<ChartData[]>([]);
  const [view, setView] = useState<ViewMode>('weekly');
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const { toast } = useToast();

  const fetchMoodData = async () => {
    // If patient ID is provided, fetch that specific patient's data (for clinician view)
    // Otherwise, fetch the current user's data (for patient view)
    let query = supabase
      .from('mood_entries')
      .select('mood_score, created_at, triggers, notes')
      .order('created_at', { ascending: true });

    if (patientId) {
      query = query.eq('patient_id', patientId);
    } else {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'User not authenticated',
        });
        return;
      }
      query = query.eq('patient_id', userData.user.id);
    }

    // Apply date filters if set
    if (dateRange.start) {
      query = query.gte('created_at', dateRange.start.toISOString());
    }
    if (dateRange.end) {
      query = query.lte('created_at', dateRange.end.toISOString());
    }

    const { data: entries, error } = await query;

    if (error) {
      console.error('Error fetching mood entries:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to load mood data',
        description: error.message,
      });
      return;
    }

    // Convert the entries to the expected format for MoodChartUtils
    const parsedEntries = entries ? entries.map(entry => ({
      ...entry,
      triggers: entry.triggers || [] // Ensure triggers is always an array
    })) as MoodChartEntry[] : [];
    
    const parsed = parseEntries(parsedEntries, view);
    setData(parsed);
  };

  useEffect(() => {
    fetchMoodData();
  }, [view, patientId, dateRange]);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
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

      <div className="mb-4">
        <MoodChartDateFilter 
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>

      <MoodChartView data={data} view={view} />
    </div>
  );
}
