
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
      <div className="space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome, Dr {clinicianName}</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>

        {/* KPIs */}
        <DashboardKPIs
          patientCount={patients.length}
          sessionCount={upcomingSessions.length}
          pendingTaskCount={pendingTaskCount}
          loadingPatients={loadingPatients}
          loadingSessions={loadingSessions}
          loadingTasks={loadingTasks}
        />

        {/* Upcoming Sessions */}
        <UpcomingSessions 
          sessions={upcomingSessions}
          loading={loadingSessions}
        />

        {/* Patient Comparison Widget - New addition */}
        <PatientComparisonWidget />

        {/* Spotlight and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PatientSpotlight 
            selectedPatient={selectedPatient}
            patients={patients}
            onPatientSelect={setSelectedPatient}
          />
          
          <ClinicianTasks
            tasks={formatTasksForComponent(tasks)}
            loadingTasks={loadingTasks}
            onAddTaskClick={() => setShowAddTaskDialog(true)}
            onTaskUpdate={updateTaskCompletion}
          />
        </div>

        {/* Recent Reports */}
        <RecentReports patients={patients} />
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
