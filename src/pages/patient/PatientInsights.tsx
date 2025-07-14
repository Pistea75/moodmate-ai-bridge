
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { MoodChart } from '@/components/mood/MoodChart';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientInsights() {
  const { t } = useLanguage();
  
  const insights = [
    {
      id: 1,
      title: t('weeklyMoodSummary'),
      description: t('moodStableThisWeek')
    },
    {
      id: 2,
      title: t('activityImpact'),
      description: t('exercisePositiveImpact')
    }
  ];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('insights')}</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('moodTrends')}</h2>
            <MoodChart showLogButton={true} />
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
