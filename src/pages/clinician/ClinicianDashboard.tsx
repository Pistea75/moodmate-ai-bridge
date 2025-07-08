
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { DashboardKPIs } from '@/components/clinician/DashboardKPIs';
import { UpcomingSessions } from '@/components/clinician/UpcomingSessions';
import { PatientSpotlight } from '@/components/clinician/PatientSpotlight';
import { ClinicianTasks } from '@/components/clinician/ClinicianTasks';
import { AddTaskDialog } from '@/components/clinician/AddTaskDialog';
import { RecentReports } from '@/components/clinician/RecentReports';
import { PatientComparisonWidget } from '@/components/clinician/PatientComparisonWidget';
import { useDashboardData } from '@/hooks/useDashboardData';

export default function ClinicianDashboard() {
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  
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

  const handleAddTask = async () => {
    if (!newTask.title) return;
    
    await addTask(
      newTask.title, 
      newTask.description, 
      newTask.dueDate || new Date().toISOString().split('T')[0]
    );
    
    setNewTask({ title: '', description: '', dueDate: '' });
    setShowAddTaskDialog(false);
  };

  return (
    <ClinicianLayout>
      <div className="container mx-auto px-4 py-6 space-y-8 max-w-7xl">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, Dr. {clinicianName || 'Doctor'}
          </h1>
          <p className="text-gray-600 text-lg">
            Here's your practice overview for today
          </p>
        </div>

        {/* KPIs Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Practice Overview</h2>
          <DashboardKPIs
            patientCount={patients.length}
            sessionCount={upcomingSessions.length}
            pendingTaskCount={pendingTaskCount}
            loadingPatients={loadingPatients}
            loadingSessions={loadingSessions}
            loadingTasks={loadingTasks}
          />
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <UpcomingSessions 
            sessions={upcomingSessions}
            loading={loadingSessions}
          />
        </div>

        {/* Patient Comparison Widget */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <PatientComparisonWidget />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Patient Spotlight */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <PatientSpotlight 
              selectedPatient={selectedPatient}
              patients={patients}
              onPatientSelect={setSelectedPatient}
            />
          </div>
          
          {/* Clinician Tasks */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <ClinicianTasks
              tasks={formatTasksForComponent(tasks)}
              loadingTasks={loadingTasks}
              onAddTaskClick={() => setShowAddTaskDialog(true)}
              onTaskUpdate={updateTaskCompletion}
            />
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <RecentReports patients={patients} />
        </div>
      </div>

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={showAddTaskDialog}
        onOpenChange={setShowAddTaskDialog}
        newTask={newTask}
        onTaskChange={setNewTask}
        onAddTask={handleAddTask}
      />
    </ClinicianLayout>
  );
}
