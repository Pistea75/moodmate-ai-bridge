
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Award, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function WellnessStreakCard() {
  const { t } = useLanguage();

  // Mock data - in real implementation, this would come from your backend
  const streakData = {
    currentStreak: 7,
    longestStreak: 14,
    weeklyTarget: 5,
    achievements: ['mood_tracker', 'task_master', 'session_regular'] as const
  };

  const achievementIcons = {
    mood_tracker: '🎯',
    task_master: '✅',
    session_regular: '📅'
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Zap className="h-5 w-5" />
          {t('wellnessStreak')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <div className="text-3xl font-bold text-purple-700">
            {streakData.currentStreak}
          </div>
          <div className="text-sm text-muted-foreground">
            {t('daysInARow')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {streakData.longestStreak}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('longestStreak')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-700">
              {streakData.weeklyTarget}
            </div>
            <div className="text-xs text-muted-foreground">
              {t('weeklyTarget')}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">{t('recentAchievements')}</div>
          <div className="flex flex-wrap gap-2">
            {streakData.achievements.map((achievement) => (
              <Badge key={achievement} variant="secondary" className="text-xs">
                {achievementIcons[achievement]} {t(achievement)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
