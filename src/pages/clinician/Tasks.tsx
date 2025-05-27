
import { useState } from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Dialog } from '@/components/ui/dialog';
import { useDashboardData } from '@/hooks/useDashboardData';
import { TaskForm } from '@/components/clinician/TaskForm';
import { ClinicianTasksCard } from '@/components/clinician/ClinicianTasksCard';
import { PatientTasksCard } from '@/components/clinician/PatientTasksCard';

export default function Tasks() {
  const {
    tasks,
    loadingTasks,
    updateTaskCompletion,
    addTask,
  } = useDashboardData();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const handleAddTaskClick = () => {
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = async () => {
    setIsTaskModalOpen(false);
  };

  const handleTaskCancel = () => {
    setIsTaskModalOpen(false);
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        
        <div className="grid gap-6">
          <ClinicianTasksCard
            tasks={tasks}
            loadingTasks={loadingTasks}
            onAddTaskClick={handleAddTaskClick}
            onTaskUpdate={updateTaskCompletion}
          />
          
          <PatientTasksCard />
        </div>
      </div>

      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <TaskForm
          isEdit={false}
          onSave={handleTaskSave}
          onCancel={handleTaskCancel}
        />
      </Dialog>
    </ClinicianLayout>
  );
}
