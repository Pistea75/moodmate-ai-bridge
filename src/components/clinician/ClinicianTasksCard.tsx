
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { TaskList } from '@/components/TaskList';

interface ClinicianTasksCardProps {
  tasks: any[];
  loadingTasks: boolean;
  onAddTaskClick: () => void;
  onTaskUpdate: (taskId: string, completed: boolean) => void;
}

export function ClinicianTasksCard({ 
  tasks, 
  loadingTasks, 
  onAddTaskClick,
  onTaskUpdate 
}: ClinicianTasksCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Your Tasks</CardTitle>
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
      </CardHeader>
      <CardContent>
        <TaskList 
          variant="clinician" 
          patientName="Clinician"
          tasks={tasks}
          onTaskUpdate={onTaskUpdate}
          loading={loadingTasks}
        />
      </CardContent>
    </Card>
  );
}
