
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface MoodEntry {
  mood_score: number;
  created_at: string;
}

interface TimeSlotMood {
  label: string;
  averageMood: number;
  count: number;
}

const TIME_SLOTS = [
  { label: 'Night (0–6)', start: 0, end: 6 },
  { label: 'Morning (6–12)', start: 6, end: 12 },
  { label: 'Afternoon (12–18)', start: 12, end: 18 },
  { label: 'Evening (18–24)', start: 18, end: 24 }
];

export function PatientMoodTimeBreakdown({ patientId }: { patientId: string }) {
  const [moods, setMoods] = useState<TimeSlotMood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoods = async () => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at')
        .eq('patient_id', patientId);

      if (error) {
        console.error('Error fetching moods by time of day:', error);
        return;
      }

      const grouped: { [label: string]: number[] } = {};

      for (const slot of TIME_SLOTS) {
        grouped[slot.label] = [];
      }

      data?.forEach((entry: MoodEntry) => {
        const hour = new Date(entry.created_at).getHours();
        const slot = TIME_SLOTS.find(s => hour >= s.start && hour < s.end);
        if (slot) {
          grouped[slot.label].push(entry.mood_score);
        }
      });

      const result = Object.entries(grouped).map(([label, scores]) => ({
        label,
        averageMood:
          scores.length > 0
            ? parseFloat((scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1))
            : 0,
        count: scores.length
      }));

      setMoods(result);
      setLoading(false);
    };

    fetchMoods();
  }, [patientId]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mood by Time of Day</h2>
      {loading ? (
        <p className="text-muted-foreground">Loading mood time breakdown...</p>
      ) : (
        <div className="grid gap-3 text-sm">
          {moods.map((slot) => (
            <div key={slot.label} className="flex justify-between border-b py-1">
              <span>{slot.label}</span>
              <span
                className={`font-medium ${
                  slot.averageMood === 0
                    ? 'text-muted-foreground'
                    : slot.averageMood < 4
                    ? 'text-red-500'
                    : slot.averageMood < 7
                    ? 'text-yellow-500'
                    : 'text-green-600'
                }`}
              >
                {slot.count > 0
                  ? `${slot.averageMood} (${slot.count} logs)`
                  : 'No data'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
