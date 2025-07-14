
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Flame, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePatientDashboard } from "@/hooks/usePatientDashboard";

export function WellnessStreakCard() {
  const { t } = useLanguage();
  const { stats, loading } = usePatientDashboard();

  const achievements = [
    { 
      id: 'mood_tracker', 
      icon: Target, 
      condition: stats.currentStreak >= 3,
      description: t('mood_tracker')
    },
    { 
      id: 'task_master', 
      icon: Award, 
      condition: stats.tasksCompleted >= 5,
      description: t('task_master')
    },
    { 
      id: 'session_regular', 
      icon: Flame, 
      condition: stats.upcomingSessions > 0,
      description: t('session_regular')
    },
  ];

  const unlockedAchievements = achievements.filter(a => a.condition);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5" />
            {t('wellnessStreak')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-16 bg-gray-200 rounded animate-pulse"></div>
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
          <Flame className="h-5 w-5" />
          {t('wellnessStreak')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {stats.currentStreak}
          </div>
          <p className="text-sm text-muted-foreground">
            {t('daysInARow')}
          </p>
          <div className="mt-2">
            <Badge variant={stats.currentStreak >= 7 ? "default" : "secondary"}>
              {stats.currentStreak >= 7 ? t('improvingWell') : t('weeklyTarget')}
            </Badge>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
          <span className="text-sm font-medium">{t('longestStreak')}</span>
          <span className="text-lg font-bold text-orange-600">
            {stats.longestStreak} {t('daysInARow')}
          </span>
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium">{t('recentAchievements')}</h4>
            <div className="space-y-2">
              {unlockedAchievements.map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <Icon className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-700">
                      {achievement.description}
                    </span>
                    <Badge variant="default" className="ml-auto">
                      ✓
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
