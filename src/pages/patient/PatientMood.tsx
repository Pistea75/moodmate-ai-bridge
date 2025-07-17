
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Brain, Heart, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';
import { useMoodEntries } from '@/hooks/useMoodEntries';

export default function PatientMood() {
  const { t } = useLanguage();
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
            <h1 className="text-4xl font-bold text-gray-900">
              Mood Tracking
            </h1>
            <p className="text-xl text-gray-600">
              Track your mood patterns and emotional well-being over time
            </p>
          </div>
          <MoodLogModal 
            onLogComplete={handleMoodLogComplete}
            trigger={
              <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4" />
                Log Mood
              </Button>
            }
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{averageMood}</div>
              <p className="text-xs text-muted-foreground">
                Average mood score
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Entries</CardTitle>
              <Brain className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{moods.length}</div>
              <p className="text-xs text-muted-foreground">
                Total logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
              <Heart className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{currentStreak}</div>
              <p className="text-xs text-muted-foreground">
                Recent entries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mood Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">Mood Trends</h2>
          </div>
          <MoodChart showLogButton={false} />
        </div>

        {/* Insights Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              AI Insights
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
      </div>
    </PatientLayout>
  );
}
