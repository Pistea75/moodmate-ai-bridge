
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Calendar, CheckSquare } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";

export function ProgressOverviewCard() {
  const { t } = useTranslation();
  const { stats, loading } = usePatientDashboard();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {t('progressOverview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          {t('progressOverview')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Goals */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('weeklyGoals')}</span>
            <span className="text-sm text-muted-foreground">
              {Math.round(stats.weeklyGoalProgress)}%
            </span>
          </div>
          <Progress value={stats.weeklyGoalProgress} className="h-2" />
        </div>

        {/* Tasks Completed */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{t('tasksCompleted')}</span>
          </div>
          <span className="text-lg font-bold text-green-600">
            {stats.tasksCompleted}/{stats.totalTasks}
          </span>
        </div>

        {/* Upcoming Sessions */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{t('upcomingSessions')}</span>
          </div>
          <span className="text-lg font-bold text-blue-600">
            {stats.upcomingSessions}
          </span>
        </div>

        {/* Mood Stability */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{t('moodStability')}</span>
            <span className="text-sm text-muted-foreground">
              {stats.recentMoodAverage.toFixed(1)}/10
            </span>
          </div>
          <Progress 
            value={(stats.recentMoodAverage / 10) * 100} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
}
