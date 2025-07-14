
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Calendar, CheckSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function ProgressOverviewCard() {
  const { t } = useLanguage();

  // Mock data - in real implementation, this would come from your backend
  const progressData = {
    weeklyGoals: 75,
    monthlyMood: 68,
    tasksCompleted: 85,
    sessionAttendance: 100
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {t('progressOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('weeklyGoals')}</span>
            <span className="text-sm text-muted-foreground">{progressData.weeklyGoals}%</span>
          </div>
          <Progress value={progressData.weeklyGoals} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('moodStability')}</span>
            <span className="text-sm text-muted-foreground">{progressData.monthlyMood}%</span>
          </div>
          <Progress value={progressData.monthlyMood} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('tasksCompleted')}</span>
            <span className="text-sm text-muted-foreground">{progressData.tasksCompleted}%</span>
          </div>
          <Progress value={progressData.tasksCompleted} className="h-2" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('sessionAttendance')}</span>
            <span className="text-sm text-muted-foreground">{progressData.sessionAttendance}%</span>
          </div>
          <Progress value={progressData.sessionAttendance} className="h-2" />
        </div>

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-green-600">
            <TrendingUp className="h-4 w-4" />
            <span>{t('improvingWell')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
