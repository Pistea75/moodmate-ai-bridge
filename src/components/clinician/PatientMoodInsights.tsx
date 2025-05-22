// components/clinician/PatientMoodInsights.tsx
import { Card } from "@/components/ui/card";

interface MoodStats {
  averageMood: number;
  highestDay: string;
  lowestDay: string;
}

interface Props {
  patientName: string;
  moodStats?: MoodStats;
}

export function PatientMoodInsights({ patientName, moodStats }: Props) {
  const capitalizedName =
    patientName.charAt(0).toUpperCase() + patientName.slice(1);

  const insights = [
    {
      title: "Weekly Mood Summary",
      description: moodStats
        ? `${capitalizedName}'s average mood this week was ${
            ["Very Low", "Low", "Neutral", "Good", "Excellent"][
              Math.round(moodStats.averageMood) - 1
            ]
          }.` // maps mood 1–5 to label
        : `Not enough data to generate a summary.`,
    },
    {
      title: "Mood Extremes",
      description: moodStats
        ? moodStats.highestDay === moodStats.lowestDay
          ? `${capitalizedName} only logged mood on ${moodStats.highestDay}.`
          : `${capitalizedName} felt best on ${moodStats.highestDay} and lowest on ${moodStats.lowestDay}.`
        : `Waiting for more mood logs to identify patterns.`,
    },
  ];

  return (
    <div className="grid gap-4 mt-6">
      {insights.map((insight, i) => (
        <Card key={i} className="p-4">
          <h3 className="font-medium">{insight.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {insight.description}
          </p>
        </Card>
      ))}
    </div>
  );
}


