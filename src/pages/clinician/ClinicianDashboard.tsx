
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, ClipboardList, AlertTriangle, TrendingUp } from 'lucide-react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { WelcomeBanner } from '@/components/clinician/WelcomeBanner';
import { QuickStats } from '@/components/clinician/QuickStats';
import { UpcomingSessions } from '@/components/clinician/UpcomingSessions';
import { PatientSpotlight } from '@/components/clinician/PatientSpotlight';
import { ClinicianTasks } from '@/components/clinician/ClinicianTasks';
import { TaskForm } from '@/components/clinician/TaskForm/index';
import { ScheduleSessionModal } from '@/components/session/ScheduleSessionModal';
import { RecentReports } from '@/components/clinician/RecentReports';
import { RiskAlertBanner } from '@/components/clinician/RiskAlertBanner';
import { AdvancedAnalytics } from '@/components/clinician/AdvancedAnalytics';

export default function ClinicianDashboard() {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setTaskRefreshKey(prev => prev + 1); // Force refresh of tasks
  };

  const handleScheduleSession = () => {
    setShowSessionModal(true);
  };

  const handleSessionScheduled = () => {
    setShowSessionModal(false);
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <WelcomeBanner />
        
        <RiskAlertBanner />
        
        <QuickStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <UpcomingSessions onScheduleSession={handleScheduleSession} />
            <RecentReports />
          </div>
          
          <div className="space-y-6">
            <PatientSpotlight />
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  My Tasks
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => setShowTaskForm(true)}
                  className="bg-mood-purple hover:bg-mood-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Task
                </Button>
              </CardHeader>
              <CardContent>
                <ClinicianTasks key={taskRefreshKey} />
              </CardContent>
            </Card>
          </div>
        </div>

        <AdvancedAnalytics />
      </div>

      {showTaskForm && (
        <TaskForm
          open={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}

      {showSessionModal && (
        <ScheduleSessionModal
          open={showSessionModal}
          onClose={() => setShowSessionModal(false)}
          onScheduled={handleSessionScheduled}
          isPatientView={false}
        />
      )}
    </ClinicianLayout>
  );
}
