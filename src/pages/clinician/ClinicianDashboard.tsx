
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ClipboardList, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { DashboardInsights } from '@/components/clinician/DashboardInsights';
import { useDashboardData } from '@/hooks/useDashboardData';
import { InvitePatientForm } from '@/components/patient/InvitePatientForm';

export default function ClinicianDashboard() {
  const { t } = useTranslation();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [taskRefreshKey, setTaskRefreshKey] = useState(0);

  const {
    patients,
    upcomingSessions,
    selectedPatient,
    setSelectedPatient,
    loadingSessions,
    tasks,
    loadingTasks,
    updateTaskCompletion,
    addTask
  } = useDashboardData();

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    setTaskRefreshKey(prev => prev + 1);
  };

  const handleScheduleSession = () => {
    setShowSessionModal(true);
  };

  const handleSessionScheduled = () => {
    setShowSessionModal(false);
  };

  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };

  const handleTaskUpdate = async (taskId: string, completed: boolean) => {
    await updateTaskCompletion(taskId, completed);
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6 p-6">
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        {/* Risk Alert Banner */}
        <RiskAlertBanner />
        
        {/* Quick Stats */}
        <QuickStats />
        
        {/* Main Content */}
        <div className="space-y-6">
          {/* Upcoming Sessions - Full Width */}
          <UpcomingSessions 
            sessions={upcomingSessions} 
            loading={loadingSessions} 
          />
          
          {/* Patient Spotlight - Full Width */}
          <Card>
            <CardContent className="p-6">
              <PatientSpotlight 
                selectedPatient={selectedPatient}
                patients={patients}
                onPatientSelect={setSelectedPatient}
              />
            </CardContent>
          </Card>
          
          {/* Practice Insights - Full Width */}
          <DashboardInsights />
          
          {/* Bottom Grid - Tasks, Recent Reports, and Invite Patient */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Tasks */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  {t('myTasks')}
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={handleAddTaskClick}
                  className="bg-mood-purple hover:bg-mood-purple/90"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('addTask')}
                </Button>
              </CardHeader>
              <CardContent>
                <ClinicianTasks 
                  key={taskRefreshKey}
                  tasks={tasks}
                  loadingTasks={loadingTasks}
                  onAddTaskClick={handleAddTaskClick}
                  onTaskUpdate={handleTaskUpdate}
                />
              </CardContent>
            </Card>
            
            {/* Recent Reports */}
            <Card>
              <CardContent className="p-6">
                <RecentReports patients={patients} />
              </CardContent>
            </Card>
            
            {/* Invite Patient */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Invitar Paciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InvitePatientForm onSuccess={() => {}} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
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
