
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { MoodChart } from '@/components/MoodChart';

export default function PatientInsights() {
  const insights = [
    {
      id: 1,
      title: "Weekly Mood Summary",
      description: "Your mood has been more stable this week compared to last week. Great progress!"
    },
    {
      id: 2,
      title: "Activity Impact",
      description: "Exercise sessions seem to positively impact your mood. Consider maintaining this routine."
    }
  ];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Insights</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Mood Trends</h2>
            <MoodChart />
          </Card>

          <div className="grid gap-4">
            {insights.map((insight) => (
              <Card key={insight.id} className="p-4">
                <h3 className="font-medium">{insight.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {insight.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
