
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { DashboardKPIs } from '@/components/clinician/DashboardKPIs';
import { EnhancedQuickActions } from '@/components/clinician/EnhancedQuickActions';
import { NotificationsPanel } from '@/components/clinician/NotificationsPanel';
import { DashboardInsights } from '@/components/clinician/DashboardInsights';
import { OnboardingTooltips } from '@/components/clinician/OnboardingTooltips';
import { UpcomingSessions } from '@/components/clinician/UpcomingSessions';
import { PatientSpotlight } from '@/components/clinician/PatientSpotlight';
import { ClinicianTasks } from '@/components/clinician/ClinicianTasks';
import { TaskForm } from '@/components/clinician/TaskForm';
import { ScheduleSessionModal } from '@/components/session/ScheduleSessionModal';
import { RecentReports } from '@/components/clinician/RecentReports';
import { RiskAlertBanner } from '@/components/clinician/RiskAlertBanner';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function ClinicianDashboard() {
  console.log('🔄 ClinicianDashboard rendering');
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showScheduleSessionModal, setShowScheduleSessionModal] = useState(false);
  
  const {
    patients,
    upcomingSessions,
    selectedPatient,
    setSelectedPatient,
    loadingPatients,
    loadingSessions,
    tasks,
    loadingTasks,
    clinicianName,
    updateTaskCompletion,
    addTask,
    formatTasksForComponent,
    pendingTaskCount
  } = useDashboardData();

  console.log('📊 Dashboard data:', {
    patients: patients.length,
    upcomingSessions: upcomingSessions.length,
    tasks: tasks.length,
    clinicianName,
    loadingPatients,
    loadingSessions,
    loadingTasks
  });

  const handleTaskCreated = () => {
    setShowTaskForm(false);
  };

  const handleScheduleSession = () => {
    setShowScheduleSessionModal(true);
  };

  const handleSessionScheduled = () => {
    setShowScheduleSessionModal(false);
  };

  return (
    <ClinicianLayout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
          {/* Risk Alert Banner */}
          <RiskAlertBanner />

          {/* Enhanced Header Section */}
          <div id="dashboard-header" className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, Dr. {clinicianName || 'Doctor'}
                </h1>
                <p className="text-gray-600 text-lg">
                  Here's your practice overview for {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
                <div className="text-sm text-gray-500">Current Time</div>
              </div>
            </div>
          </div>

          {/* Dashboard KPIs */}
          <DashboardKPIs
            patientCount={patients.length}
            sessionCount={upcomingSessions.length}
            pendingTaskCount={pendingTaskCount}
            loadingPatients={loadingPatients}
            loadingSessions={loadingSessions}
            loadingTasks={loadingTasks}
          />

          {/* Enhanced Quick Actions */}
          <div id="quick-actions">
            <EnhancedQuickActions 
              onScheduleSession={handleScheduleSession}
              onAddTask={() => setShowTaskForm(true)}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="xl:col-span-2 space-y-6">
              {/* Upcoming Sessions */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <UpcomingSessions 
                  sessions={upcomingSessions}
                  loading={loadingSessions}
                />
              </div>

              {/* Dashboard Insights */}
              <DashboardInsights />

              {/* Patient Spotlight */}
              <div id="patient-spotlight" className="bg-white rounded-xl shadow-sm border p-6">
                <PatientSpotlight 
                  selectedPatient={selectedPatient}
                  patients={patients}
                  onPatientSelect={setSelectedPatient}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Notifications Panel */}
              <div id="notifications">
                <NotificationsPanel />
              </div>

              {/* Clinician Tasks */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <ClinicianTasks
                  tasks={formatTasksForComponent(tasks)}
                  loadingTasks={loadingTasks}
                  onAddTaskClick={() => setShowTaskForm(true)}
                  onTaskUpdate={updateTaskCompletion}
                />
              </div>
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <RecentReports patients={patients} />
          </div>
        </div>

        {/* Onboarding Tooltips */}
        <OnboardingTooltips />

        {/* Modals */}
        <TaskForm
          open={showTaskForm}
          onClose={() => setShowTaskForm(false)}
          onTaskCreated={handleTaskCreated}
        />

        <ScheduleSessionModal
          open={showScheduleSessionModal}
          onClose={() => setShowScheduleSessionModal(false)}
          onScheduled={handleSessionScheduled}
          isPatientView={false}
        />
      </div>
    </ClinicianLayout>
  );
}
