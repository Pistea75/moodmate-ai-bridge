
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Calendar, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePatientDashboard } from '@/hooks/usePatientDashboard';

export function WellnessJourneyCard() {
  const navigate = useNavigate();
  const { stats } = usePatientDashboard();

  const handleViewProgress = () => {
    navigate('/patient/insights');
  };

  const progressPercentage = stats.weeklyGoalProgress || 0;
  const moodScore = stats.recentMoodAverage || 0;
  
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-blue-600';
    if (progress >= 40) return 'text-yellow-600';
    return 'text-orange-600';
  };

  const getMoodBadge = (score: number) => {
    if (score >= 8) return { text: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 6) return { text: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 4) return { text: 'Fair', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Needs Attention', color: 'bg-red-100 text-red-800' };
  };

  const moodBadge = getMoodBadge(moodScore);

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Sparkles className="h-5 w-5" />
          Your Wellness Journey
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weekly Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Weekly Goals
            </span>
            <span className={`text-sm font-semibold ${getProgressColor(progressPercentage)}`}>
              {Math.round(progressPercentage)}%
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Mood Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Recent Mood
            </span>
            <Badge className={moodBadge.color}>
              {moodBadge.text}
            </Badge>
          </div>
          <div className="text-xs text-muted-foreground">
            Average: {moodScore.toFixed(1)}/10 over last 7 days
          </div>
        </div>

        {/* Streak Info */}
        <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Current Streak</span>
          </div>
          <span className="text-lg font-bold text-purple-600">
            {stats.currentStreak} days
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={handleViewProgress}
            size="sm"
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
