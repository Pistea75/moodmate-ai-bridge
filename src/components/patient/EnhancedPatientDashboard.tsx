
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  Brain,
  Plus,
  Heart,
  Activity
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { TasksCompletedCard } from './TasksCompletedCard';
import { UpcomingSessionsCard } from './UpcomingSessionsCard';
import { QuickActionsCard } from './QuickActionsCard';
import { WellnessStreakCard } from './WellnessStreakCard';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';
import { useMoodEntries } from '@/hooks/useMoodEntries';

export function EnhancedPatientDashboard() {
  const { t } = useTranslation();
  const { stats, loading } = usePatientDashboard();
  const { moods, refetch } = useMoodEntries();

  // Calculate recent stats from mood entries
  const recentMoods = moods.slice(-7); // Last 7 entries
  const averageMood = recentMoods.length > 0 
    ? (recentMoods.reduce((sum, mood) => sum + mood.mood_score, 0) / recentMoods.length).toFixed(1)
    : '0.0';
  
  const currentStreak = moods.length > 0 ? Math.min(moods.length, 7) : 0;

  const handleMoodLogComplete = () => {
    console.log('Mood logged successfully, refreshing data...');
    refetch();
  };

  if (loading) {
    return (
      <div className="p-8 space-y-8">
        <div className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {t('welcomeBack')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('todayProgress')}
          </p>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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

        <TasksCompletedCard />

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('sessionsToday')}</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              {t('scheduledSessions')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Mood Trends Chart and Wellness Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        {/* Mood Chart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold">{t('moodTrends')}</h2>
              </div>
              <MoodLogModal 
                onLogComplete={handleMoodLogComplete}
                trigger={
                  <Button size="sm" className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4" />
                    {t('logMood')}
                  </Button>
                }
              />
            </div>
            <MoodChart showLogButton={false} />
          </div>
        </div>

        {/* Wellness Streak Card */}
        <div className="lg:col-span-1">
          <WellnessStreakCard />
        </div>
      </div>

      {/* Quick Actions Card */}
      <div className="grid grid-cols-1 gap-6">
        <QuickActionsCard />
      </div>

      {/* Upcoming Sessions Card */}
      <div className="grid grid-cols-1 gap-6">
        <UpcomingSessionsCard />
      </div>

      {/* Insights Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            {t('aiInsights')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentMoods.length > 0 ? (
              <>
                <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-purple-900 mb-2">Pattern Detected</h4>
                  <p className="text-purple-700 text-sm">
                    Your average mood this week is {averageMood}/10. 
                    {parseFloat(averageMood) >= 7 ? " You're doing great! Keep up the positive momentum." 
                     : parseFloat(averageMood) >= 5 ? " You're maintaining a stable mood. Consider what activities make you feel better."
                     : " Consider reaching out for support. Remember that ups and downs are normal."}
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                  <p className="text-blue-700 text-sm">
                    You've logged {moods.length} mood entries! 
                    {moods.length >= 7 ? " Consistent tracking helps us provide better insights and support."
                     : " Try to log your mood daily for more personalized insights."}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-500">
                <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
                <p className="text-gray-700 text-sm">
                  Start tracking your mood to see patterns and get personalized insights. Click "Log Mood" above to begin!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Floating AI Chat Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button
          onClick={() => window.location.href = '/patient/chat'}
          className="h-14 w-14 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
