
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  CheckSquare, 
  Calendar, 
  MessageSquare, 
  Plus,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AIInsightsCard } from './AIInsightsCard';
import { MoodAnalyticsCard } from './MoodAnalyticsCard';
import { RecentActivityFeed } from './RecentActivityFeed';
import { ChatNowCard } from './ChatNowCard';
import { TriggerSuggestion } from './TriggerSuggestion';
import { MoodStatsCard } from './MoodStatsCard';
import { TasksCompletedCard } from './TasksCompletedCard';
import { UpcomingSessionsCard } from './UpcomingSessionsCard';
import { ExerciseTrackingCard } from './ExerciseTrackingCard';
import { MoodLogModal } from './MoodLogModal';

export function EnhancedPatientDashboard() {
  const [showMoodModal, setShowMoodModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Section with AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AIInsightsCard />
        <ChatNowCard />
      </div>

      {/* Trigger Suggestions */}
      <TriggerSuggestion />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              onClick={() => setShowMoodModal(true)}
              className="h-16 flex-col gap-2"
              variant="outline"
            >
              <Heart className="h-5 w-5" />
              <span className="text-xs">Log Mood</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/tasks'}
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-xs">View Tasks</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/sessions'}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">Sessions</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/chat'}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">AI Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MoodStatsCard />
        <TasksCompletedCard />
        <UpcomingSessionsCard />
        <ExerciseTrackingCard />
      </div>

      {/* Analytics and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MoodAnalyticsCard />
        <RecentActivityFeed />
      </div>

      {/* Mood Log Modal */}
      <MoodLogModal 
        isOpen={showMoodModal} 
        onClose={() => setShowMoodModal(false)} 
      />
    </div>
  );
}
