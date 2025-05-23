
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { MoodStatsCard } from '@/components/patient/MoodStatsCard';
import { TasksCompletedCard } from '@/components/patient/TasksCompletedCard';
import { PatientReports } from '@/components/patient/PatientReports';

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <MoodChart />
          </div>
          <div className="flex flex-col space-y-6">
            <MoodStatsCard />
            <TasksCompletedCard />
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PatientReports />
          </div>
          <div>
            <MoodLogModal />
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
