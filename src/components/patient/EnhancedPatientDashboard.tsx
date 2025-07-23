
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

export function EnhancedPatientDashboard() {
  const { t } = useLanguage();

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">
          {t('welcomeBackMessage')}
        </h1>
        <p className="text-xl text-gray-600">
          {t('yourMentalHealthOverview')}
        </p>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <QuickActionsCard />
          
          {/* Progress Overview */}
          <ProgressOverviewCard />
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodStatsCard />
            <TasksCompletedCard />
          </div>
          
          {/* Upcoming Sessions */}
          <UpcomingSessionsCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Motivational Quote */}
          <MotivationalQuoteCard />
          
          {/* Daily Check-in */}
          <DailyCheckinCard />
          
          {/* Wellness Journey */}
          <WellnessJourneyCard />
          
          {/* AI Insights */}
          <AIInsightsCard />
          
          {/* Wellness Streak */}
          <WellnessStreakCard />
        </div>
      </div>
      
      {/* Brodi AI Companion */}
      <BrodiEngine context="dashboard" />
    </div>
  );
}
