
import { useLanguage } from "@/contexts/LanguageContext";
import { ProgressOverviewCard } from "./ProgressOverviewCard";
import { WellnessStreakCard } from "./WellnessStreakCard";
import { MotivationalQuoteCard } from "./MotivationalQuoteCard";
import { MoodStatsCard } from "./MoodStatsCard";
import { TasksCompletedCard } from "./TasksCompletedCard";
import { UpcomingSessionsCard } from "./UpcomingSessionsCard";
import { Button } from "@/components/ui/button";
import { Calendar, MessageSquare, Target, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EnhancedPatientDashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t('welcomeBackMessage')}
        </h1>
        <p className="text-gray-600 text-lg">
          {t('yourMentalHealthOverview')}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/patient/mood')}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">{t('logMood')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/patient/tasks')}
          >
            <Target className="h-5 w-5" />
            <span className="text-xs">{t('viewTasks')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/patient/chat')}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">{t('aiChat')}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => navigate('/patient/sessions')}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">{t('sessions')}</span>
          </Button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressOverviewCard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MoodStatsCard />
            <TasksCompletedCard />
          </div>
          <UpcomingSessionsCard />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <WellnessStreakCard />
          <MotivationalQuoteCard />
        </div>
      </div>
    </div>
  );
}
