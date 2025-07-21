
import PatientLayout from '../../layouts/PatientLayout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Brain, TrendingUp, Activity, Lightbulb, Target, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';
import { useMoodEntries } from '@/hooks/useMoodEntries';

export default function PatientInsights() {
  const { t } = useLanguage();
  const { stats, loading } = usePatientDashboard();
  const { moods } = useMoodEntries();

  // Calculate insights from mood data
  const recentMoods = moods.slice(-7); // Last 7 entries
  const averageMood = recentMoods.length > 0 
    ? recentMoods.reduce((sum, mood) => sum + mood.mood_score, 0) / recentMoods.length
    : 0;

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
      title: 'Weekly Mood Summary',
      description: recentMoods.length > 0 
        ? `Your mood has been ${trend} this week with an average of ${averageMood.toFixed(1)}/10.`
        : 'Start logging your mood to see personalized insights here.',
      type: trend === 'improving' ? 'positive' as const : trend === 'declining' ? 'warning' as const : 'neutral' as const,
      metric: recentMoods.length > 0 ? `${averageMood.toFixed(1)}/10` : 'No data'
    },
    {
      id: 'activity-impact',
      icon: Activity,
      title: 'Tracking Consistency',
      description: moods.length >= 7 
        ? 'Great job maintaining consistent mood tracking! This helps us provide better insights.'
        : 'Try to log your mood daily for more accurate patterns and personalized recommendations.',
      type: moods.length >= 7 ? 'positive' as const : 'neutral' as const,
      metric: `${moods.length} entries`
    },
    {
      id: 'goals-progress',
      icon: Target,
      title: 'Wellness Goals',
      description: 'Setting and tracking wellness goals can help improve your mental health journey.',
      type: 'neutral' as const,
      metric: 'Get started'
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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AI Insights
          </h1>
          <p className="text-xl text-muted-foreground">
            Personalized insights based on your mental health journey
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
              Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Mood Tracking Consistency</span>
                <span className="text-sm text-muted-foreground">
                  {Math.min((moods.length / 30) * 100, 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={Math.min((moods.length / 30) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Based on {moods.length} mood entries this month
              </p>
            </div>

            {recentMoods.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Recent Mood Average</span>
                  <span className="text-sm text-muted-foreground">
                    {averageMood.toFixed(1)}/10
                  </span>
                </div>
                <Progress value={(averageMood / 10) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Based on your last {recentMoods.length} mood entries
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
              Wellness Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">Daily Practice</h4>
                <p className="text-blue-700 text-sm">
                  Try to log your mood at the same time each day to build a consistent habit and get more accurate insights.
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 mb-2">Mindfulness</h4>
                <p className="text-green-700 text-sm">
                  Take a few minutes each day for mindfulness or deep breathing exercises to help manage stress and improve mood.
                </p>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h4 className="font-semibold text-purple-900 mb-2">Stay Connected</h4>
                <p className="text-purple-700 text-sm">
                  Regular communication with your support network and healthcare providers is key to maintaining good mental health.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
