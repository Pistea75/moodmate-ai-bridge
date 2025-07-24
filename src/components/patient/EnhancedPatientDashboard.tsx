
import { useLanguage } from "@/contexts/LanguageContext";
import { ProgressOverviewCard } from "./ProgressOverviewCard";
import { WellnessStreakCard } from "./WellnessStreakCard";
import { MotivationalQuoteCard } from "./MotivationalQuoteCard";
import { MoodStatsCard } from "./MoodStatsCard";
import { TasksCompletedCard } from "./TasksCompletedCard";
import { UpcomingSessionsCard } from "./UpcomingSessionsCard";
import { WellnessJourneyCard } from "./WellnessJourneyCard";
import { QuickActionsCard } from "./QuickActionsCard";
import { DailyCheckinCard } from "./DailyCheckinCard";
import { AIInsightsCard } from "./AIInsightsCard";
import { BrodiEngine } from "@/components/brodi/BrodiEngine";
import { BrodiPredictiveWellness } from "@/components/brodi/BrodiPredictiveWellness";
import { BrodiCrisisSupport } from "@/components/brodi/BrodiCrisisSupport";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import { ExerciseTrackingCard } from "./ExerciseTrackingCard";
import { MoodAnalyticsCard } from "./MoodAnalyticsCard";
import { ChatNowCard } from "./ChatNowCard";

export function EnhancedPatientDashboard() {
  const { t } = useLanguage();
  const { callBrodi, brodiComponent } = BrodiEngine({ context: 'dashboard' });

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('welcomeBackMessage')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('yourMentalHealthOverview')}
            </p>
          </div>
          
          {/* Call Brodi Button */}
          <Button 
            onClick={callBrodi}
            className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-variant hover:shadow-lg transition-all duration-300"
          >
            <Bot className="h-5 w-5" />
            Call Brodi
          </Button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MoodStatsCard />
        <TasksCompletedCard />
        <UpcomingSessionsCard />
        <WellnessStreakCard />
      </div>

      {/* Mood Chart */}
      <MoodAnalyticsCard />

      {/* Quick Actions */}
      <QuickActionsCard />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressOverviewCard />
        <DailyCheckinCard />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MotivationalQuoteCard />
        <WellnessJourneyCard />
        <AIInsightsCard />
        <ExerciseTrackingCard />
      </div>

      {/* Brodi Advanced Features */}
      <BrodiPredictiveWellness />

      {/* Support Section - Bottom */}
      <ChatNowCard />
      
      {/* Brodi AI Companion & Crisis Support */}
      {brodiComponent}
      <BrodiCrisisSupport />
    </div>
  );
}
