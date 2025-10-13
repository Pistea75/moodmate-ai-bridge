import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Brain, Heart, Activity, Target, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { BrodiNudgeSystem } from '@/components/brodi/BrodiNudgeSystem';

export default function PatientMoodInsights() {
  const { t } = useTranslation();
  const { stats, loading } = usePatientDashboard();
  const { moods, refetch } = useMoodEntries();

  // Calculate recent stats from mood entries
  const recentMoods = moods.slice(-7); // Last 7 entries
  const averageMood = recentMoods.length > 0 
    ? (recentMoods.reduce((sum, mood) => sum + mood.mood_score, 0) / recentMoods.length).toFixed(1)
    : '0.0';
  
  const currentStreak = moods.length > 0 ? Math.min(moods.length, 7) : 0;

  // Calculate mood trend
  const firstHalf = recentMoods.slice(0, Math.floor(recentMoods.length / 2));
  const secondHalf = recentMoods.slice(Math.floor(recentMoods.length / 2));
  const firstHalfAvg = firstHalf.length > 0 ? firstHalf.reduce((sum, mood) => sum + mood.mood_score, 0) / firstHalf.length : 0;
  const secondHalfAvg = secondHalf.length > 0 ? secondHalf.reduce((sum, mood) => sum + mood.mood_score, 0) / secondHalf.length : 0;
  const trend = secondHalfAvg > firstHalfAvg ? 'improving' : secondHalfAvg < firstHalfAvg ? 'declining' : 'stable';

  const insights = [
    {
      id: 'mood-trend',
      icon: TrendingUp,
      title: t('moodWeeklySummary'),
      description: recentMoods.length > 0 
        ? t('moodTrendDescription', { trend: t(`moodTrend.${trend}`), average: averageMood })
        : t('startLoggingMood'),
      type: trend === 'improving' ? 'positive' as const : trend === 'declining' ? 'warning' as const : 'neutral' as const,
      metric: recentMoods.length > 0 ? `${averageMood}/10` : t('noData')
    },
    {
      id: 'activity-impact',
      icon: Activity,
      title: t('trackingConsistency'),
      description: moods.length >= 7 
        ? t('consistentTrackingMessage')
        : t('dailyLoggingRecommendation'),
      type: moods.length >= 7 ? 'positive' as const : 'neutral' as const,
      metric: t('entriesCount', { count: moods.length })
    },
    {
      id: 'goals-progress',
      icon: Target,
      title: t('wellnessGoals'),
      description: t('wellnessGoalsDescription'),
      type: 'neutral' as const,
      metric: t('getStarted')
    }
  ];

  const handleMoodLogComplete = () => {
    console.log('Mood logged successfully, refreshing data...');
    refetch();
  };

  if (loading) {
    return (
      <PatientLayout>
        <div className="p-8 space-y-8">
          <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
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
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {t('mood.title')}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t('moodInsightsDescription')}
            </p>
          </div>
          <MoodLogModal 
            onLogComplete={handleMoodLogComplete}
            trigger={
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                {t('mood.logMood')}
              </Button>
            }
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('thisWeek')}</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{averageMood}</div>
              <p className="text-xs text-muted-foreground">
                {t('averageMoodScore')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('entries')}</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{moods.length}</div>
              <p className="text-xs text-muted-foreground">
                {t('totalLogged')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('streak')}</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                {t('recentEntries')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mood Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">{t('mood.trends')}</h2>
          </div>
          <MoodChart showLogButton={false} />
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
                    <Badge variant={
                      insight.type === 'positive' ? 'default' : 
                      insight.type === 'warning' ? 'destructive' : 'secondary'
                    }>
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
                <span className="text-sm font-medium">{t('moodTrackingConsistency')}</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min((moods.length / 30) * 100, 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.min((moods.length / 30) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {t('basedOnMonthEntries', { count: moods.length })}
              </p>
            </div>

            {recentMoods.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{t('recentMoodAverage')}</span>
                  <span className="text-sm text-muted-foreground">
                    {averageMood}/10
                  </span>
                </div>
                <Progress value={(parseFloat(averageMood) / 10) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {t('basedOnLastEntries', { count: recentMoods.length })}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wellness Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-600" />
              {t('wellnessTips')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">{t('dailyPractice')}</h4>
                <p className="text-blue-700 text-sm">
                  {t('dailyPracticeDescription')}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">{t('mindfulness')}</h4>
                <p className="text-green-700 text-sm">
                  {t('mindfulnessDescription')}
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2">{t('stayConnected')}</h4>
                <p className="text-purple-700 text-sm">
                  {t('stayConnectedDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Brodi Nudge System for mood logging context */}
      <BrodiNudgeSystem 
        context="mood_logging"
        trigger={{
          type: 'page_visit',
          data: { 
            averageMood: parseFloat(averageMood),
            totalEntries: moods.length,
            streak: currentStreak
          }
        }}
      />
    </PatientLayout>
  );
}