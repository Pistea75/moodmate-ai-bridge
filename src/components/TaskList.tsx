import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TaskItem } from './task/TaskItem';
import { 
  formatDate, 
  isOverdue, 
  isToday, 
  filterTasks, 
  getEmptyTaskMessage,
  Task,
  convertDatabaseTasksToUITasks
} from './task/TaskListUtils';
import { TaskListSkeleton } from './task/TaskListSkeleton';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface TaskListProps {
  variant?: 'patient' | 'clinician';
  patientName?: string;
  tasks?: any[]; // Accept any task type from the parent
  onTaskUpdate?: (taskId: string, completed: boolean) => void;
  loading?: boolean;
}

export function TaskList({
  variant = 'patient',
  patientName,
  tasks = [],
  onTaskUpdate,
  loading = false
}: TaskListProps) {
  const { t } = useTranslation();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  
  // Convert incoming tasks to our UI format if needed and use them, otherwise use local state
  const displayTasks: Task[] = tasks.length > 0 
    ? convertDatabaseTasksToUITasks(tasks)
    : localTasks;
  
  // Filter tasks based on completion status
  const filteredTasks = filterTasks(displayTasks, showCompleted);

  const toggleTaskCompletion = async (taskId: string) => {
    // If onTaskUpdate is provided, use that instead
    if (onTaskUpdate) {
      const task = displayTasks.find(t => t.id === taskId);
      if (task) {
        onTaskUpdate(taskId, !task.completed);
      }
      return;
    }

    // Otherwise handle it internally
    setLocalTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? {
        ...task,
        completed: !task.completed
      } : task
    ));

    // In a real app, you would also update this in your database
    try {
      /* You would update the task in your database here */
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");

      // Revert the change if there's an error
      setLocalTasks(prevTasks => [...prevTasks]);
    }
  };
  
  if (loading) {
    return <TaskListSkeleton />;
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {variant === 'patient' ? t('tasks.assignedTasks') : `${t('tasks.tasksFor')} ${patientName || t('common.clinician')}`}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-xs"
          onClick={() => setShowCompleted(!showCompleted)}
        >
          {showCompleted ? (
            <>
              <CheckCircle className="h-4 w-4" />
              {t('tasks.showingCompleted')}
            </>
          ) : (
            <>
              <Circle className="h-4 w-4" />
              {t('tasks.showCompleted')}
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            variant={variant}
            toggleTaskCompletion={toggleTaskCompletion}
            formatDate={formatDate}
            isOverdue={isOverdue}
            isToday={isToday}
          />
        )) : (
          <div className="text-center py-6 text-muted-foreground">
            {getEmptyTaskMessage(showCompleted)}
          </div>
        )}
      </div>
    </div>
  );
}
