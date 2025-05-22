
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MOOD_LABELS } from '@/components/mood/MoodChartConstants';

interface MoodStats {
  averageMood: number;
  highestDay: string;
  lowestDay: string;
}

interface PatientMoodInsightsProps {
  patientName: string;
  moodStats?: MoodStats;
}

export function PatientMoodInsights({ patientName, moodStats }: PatientMoodInsightsProps) {
  if (!moodStats) {
    return (
      <Card className="mt-4">
        <CardContent className="pt-4">
          <p className="text-muted-foreground">Not enough data to generate mood insights.</p>
        </CardContent>
      </Card>
    );
  }

  // Round the average mood to the nearest integer for displaying the mood label
  const moodIndex = Math.round(moodStats.averageMood) - 1;
  const averageMoodLabel = MOOD_LABELS[moodIndex] || 'Unknown';

  return (
    <Card className="mt-4">
      <CardContent className="pt-4">
        <h3 className="text-lg font-medium mb-3">Mood Insights</h3>

        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium">Average Mood</p>
            <p className="text-sm text-muted-foreground">{averageMoodLabel} ({moodStats.averageMood.toFixed(1)})</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm font-medium">Best Day</p>
              <p className="text-sm text-muted-foreground">{moodStats.highestDay}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Most Challenging Day</p>
              <p className="text-sm text-muted-foreground">{moodStats.lowestDay}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
