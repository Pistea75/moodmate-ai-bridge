
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { MoodStatsCard } from '@/components/patient/MoodStatsCard';
import { TasksCompletedCard } from '@/components/patient/TasksCompletedCard';
import { UpcomingSessionsSection } from '@/components/patient/UpcomingSessionsSection';
import { ChatNowCard } from '@/components/patient/ChatNowCard';
import { MoodHistoryButton } from '@/components/patient/mood/MoodHistoryButton';
import { ExerciseTrackingCard } from '@/components/patient/ExerciseTrackingCard';

export default function PatientDashboard() {
  console.log('PatientDashboard component rendering');
  
  return (
    <PatientLayout>
      <div className="space-y-6 bg-background min-h-screen">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <div className="flex gap-2">
            <MoodLogModal />
            <MoodHistoryButton />
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <MoodStatsCard />
              <TasksCompletedCard />
            </div>
            
            <div className="mb-6">
              <UpcomingSessionsSection />
            </div>
            
            <MoodChart />
          </div>
          <div className="space-y-6">
            <ExerciseTrackingCard />
            <ChatNowCard />
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
