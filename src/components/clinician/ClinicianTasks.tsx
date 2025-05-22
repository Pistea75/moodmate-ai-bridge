
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { TaskList } from '@/components/TaskList';

interface ClinicianTasksProps {
  tasks: any[];
  loadingTasks: boolean;
  onAddTaskClick: () => void;
  onTaskUpdate: (taskId: string, completed: boolean) => void;
}

export function ClinicianTasks({ 
  tasks, 
  loadingTasks, 
  onAddTaskClick,
  onTaskUpdate 
}: ClinicianTasksProps) {
  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <Button 
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          onClick={onAddTaskClick}
        >
          <PlusCircle size={16} />
          <span>Add Task</span>
        </Button>
      </div>
      
      <TaskList 
        variant="clinician" 
        patientName="Clinician"
        tasks={tasks}
        onTaskUpdate={onTaskUpdate}
        loading={loadingTasks}
      />
    </div>
  );
}
