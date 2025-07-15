
import PatientLayout from '../../layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Activity, Lightbulb } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';

export default function PatientInsights() {
  const { t } = useLanguage();
  const { stats, loading } = usePatientDashboard();

  const insights = [
    {
      id: 'mood-trend',
      icon: TrendingUp,
      title: t('weeklyMoodSummary'),
      description: t('moodStableThisWeek'),
      type: 'positive' as const,
      metric: stats.recentMoodAverage.toFixed(1)
    },
    {
      id: 'activity-impact',
      icon: Activity,
      title: t('activityImpact'),
      description: t('exercisePositiveImpact'),
      type: 'neutral' as const,
      metric: `${stats.currentStreak} days`
    }
  ];

  if (loading) {
    return (
      <PatientLayout>
        <div className="p-8 space-y-8">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('insights')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('aiPersonalizedByClinician')}
          </p>
        </div>

        {/* AI Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                    {insight.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant={insight.type === 'positive' ? 'default' : 'secondary'}>
                      {insight.metric}
                    </Badge>
                    <Lightbulb className="h-4 w-4 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              {t('progressOverview')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('weeklyGoals')}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(stats.weeklyGoalProgress)}%
                </span>
              </div>
              <Progress value={stats.weeklyGoalProgress} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('moodStability')}</span>
                <span className="text-sm text-muted-foreground">
                  {stats.recentMoodAverage.toFixed(1)}/10
                </span>
              </div>
              <Progress value={(stats.recentMoodAverage / 10) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
