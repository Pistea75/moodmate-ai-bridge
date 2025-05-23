
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  patientId: string;
}

const getBadgeColor = (score: number) => {
  if (score <= 2) return 'bg-red-500';
  if (score <= 6) return 'bg-yellow-400';
  return 'bg-green-500';
};

export function PatientMoodBadge({ patientId }: Props) {
  const [mood, setMood] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestMood = async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data?.[0]) {
        setMood(data[0].mood_score);
      }
    };

    fetchLatestMood();
  }, [patientId]);

  if (mood === null) return null;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`w-3 h-3 rounded-full ${getBadgeColor(mood)}`}
        title={`Current mood score: ${mood}`}
      />
      <span className="text-sm text-muted-foreground">Mood: {mood}</span>
    </div>
  );
}
