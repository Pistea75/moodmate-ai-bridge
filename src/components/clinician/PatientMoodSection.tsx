
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '@/components/mood/MoodChart';
import { PatientMoodInsights } from '@/components/clinician/PatientMoodInsights';
import { getMostCommonTriggers } from '@/lib/analyzeMoodTriggers';
import { isHighRiskMood } from '@/lib/utils/alertTriggers';

function normalizeMood(score: number) {
  return Math.max(1, Math.min(5, Math.ceil(score / 2))); // Convert 1–10 to 1–5
}

interface PatientMoodSectionProps {
  patientId: string;
  patientName: string;
}

export function PatientMoodSection({ patientId, patientName }: PatientMoodSectionProps) {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moodStats, setMoodStats] = useState<{
    averageMood: number;
    highestDay: string;
    lowestDay: string;
  } | null>(null);
  const [topTriggers, setTopTriggers] = useState<string[]>([]);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('mood_entries')
          .select('mood_score, created_at, triggers')
          .eq('patient_id', patientId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMoodData(data || []);
        
        // Debug log for triggers
        console.log("Mood entries triggers:", data?.map(d => d.triggers));

        // Process triggers if we have data
        if (data && data.length > 0) {
          const mostCommonTriggers = getMostCommonTriggers(data);
          setTopTriggers(mostCommonTriggers);

          // Process mood data for stats
          const grouped: { [key: string]: number[] } = {};
          data.forEach(entry => {
            const date = new Date(entry.created_at);
            // Ensure we use English locale for day names
            const day = date.toLocaleDateString('en-US', { weekday: 'long' });
            if (!grouped[day]) grouped[day] = [];
            grouped[day].push(normalizeMood(entry.mood_score));
          });

          const stats = Object.entries(grouped).map(([day, moods]) => ({
            day,
            average: moods.reduce((sum, m) => sum + m, 0) / moods.length
          }));

          const averageMood =
            stats.reduce((sum, s) => sum + s.average, 0) / stats.length;

          const highest = stats.reduce((a, b) => (a.average > b.average ? a : b));
          const lowest = stats.reduce((a, b) => (a.average < b.average ? a : b));

          setMoodStats({
            averageMood,
            highestDay: highest.day,
            lowestDay: lowest.day
          });
        }
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [patientId]);

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>

      {loading ? (
        <div className="h-64 flex items-center justify-center">Loading mood data...</div>
      ) : moodData.length === 0 ? (
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
          <p className="text-muted-foreground">No mood data available for this patient.</p>
        </div>
      ) : (
        <>
          {moodData.length > 0 && (() => {
            const latestEntry = moodData[moodData.length - 1];
            const risky = isHighRiskMood(latestEntry.mood_score, latestEntry.triggers);

            return (
              <>
                {risky && (
                  <div className="bg-red-100 border border-red-300 text-red-700 p-3 mb-4 rounded-md text-sm">
                    ⚠️ Alert: Recent mood entry indicates potential crisis. Follow up recommended.
                  </div>
                )}
                <MoodChart patientId={patientId} />
              </>
            );
          })()}
          <PatientMoodInsights
            patientName={patientName}
            moodStats={moodStats || undefined}
            topTriggers={topTriggers}
          />
        </>
      )}
    </Card>
  );
}
