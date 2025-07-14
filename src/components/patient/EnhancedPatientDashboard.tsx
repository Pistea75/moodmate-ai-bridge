
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
  Activity,
  Target,
  Award,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { ProgressOverviewCard } from './ProgressOverviewCard';
import { WellnessStreakCard } from './WellnessStreakCard';
import { MotivationalQuoteCard } from './MotivationalQuoteCard';

export function EnhancedPatientDashboard() {
  const { t } = useLanguage();
  const [showMoodModal, setShowMoodModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Welcome Section with Motivational Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AIInsightsCard />
        </div>
        <MotivationalQuoteCard />
      </div>

      {/* Wellness Streak and Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WellnessStreakCard />
        <ProgressOverviewCard />
      </div>

      {/* AI Chat Now */}
      <ChatNowCard />

      {/* Trigger Suggestions */}
      <TriggerSuggestion />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {t('quickActions')}
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
              <span className="text-xs">{t('logMood')}</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/tasks'}
            >
              <CheckSquare className="h-5 w-5" />
              <span className="text-xs">{t('viewTasks')}</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/sessions'}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-xs">{t('sessions')}</span>
            </Button>
            <Button 
              className="h-16 flex-col gap-2"
              variant="outline"
              onClick={() => window.location.href = '/patient/chat'}
            >
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">{t('aiChat')}</span>
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
      {showMoodModal && (
        <MoodLogModal 
          onLogComplete={() => setShowMoodModal(false)} 
        />
      )}
    </div>
  );
}
