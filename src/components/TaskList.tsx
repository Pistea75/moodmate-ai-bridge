import { Check, Calendar } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Sample task data - this would come from your backend in a real app
const sampleTasks = [
  {
    id: 1,
    title: "Daily journaling exercise",
    dueDate: "2025-04-25",
    completed: false,
    description: "Write at least 3 positive things from your day"
  },
  {
    id: 2,
    title: "Breathing exercise - 5 minutes",
    dueDate: "2025-04-24",
    completed: true,
    description: "Practice the 4-7-8 breathing technique"
  },
  {
    id: 3,
    title: "Read assigned article",
    dueDate: "2025-04-26",
    completed: false,
    description: "Read the article on stress management techniques"
  },
  {
    id: 4,
    title: "Movement therapy - 15 minutes",
    dueDate: "2025-04-23",
    completed: true,
    description: "Complete the gentle yoga routine"
  },
];

type Task = {
  id: number;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
};

interface TaskListProps {
  variant?: 'patient' | 'clinician';
  patientName?: string;
  tasks?: Task[];
  onTaskUpdate?: (taskId: number, completed: boolean) => void;
}

export function TaskList({ 
  variant = 'patient', 
  patientName,
  tasks: propTasks,
  onTaskUpdate
}: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(propTasks || sampleTasks);

  const toggleTaskCompletion = async (taskId: number) => {
    // If onTaskUpdate is provided, use that instead
    if (onTaskUpdate) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        onTaskUpdate(taskId, !task.completed);
      }
      return;
    }

    // Otherwise handle it internally
    setTasks(
      tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
    
    // In a real app, you would also update this in your database
    try {
      /* You would update the task in your database here */
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task status");
      
      // Revert the change if there's an error
      setTasks(
        tasks.map(task => task)
      );
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Check if a task is overdue
  const isOverdue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !isToday(dateString);
  };

  // Check if a task is due today
  const isToday = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    return today.toDateString() === dueDate.toDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">
          {variant === 'patient' ? 'Assigned Tasks' : `Tasks for ${patientName || 'Clinician'}`}
        </h3>
        {variant === 'clinician' && (
          <button className="text-sm px-3 py-1 bg-mood-purple text-white rounded-md">
            Add Task
          </button>
        )}
      </div>

      <div className="space-y-3">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div 
              key={task.id}
              className={`p-3 rounded-lg border ${
                task.completed 
                  ? 'bg-muted/50 border-muted' 
                  : 'bg-white border-muted'
              }`}
            >
              <div className="flex items-start gap-3">
                <button 
                  onClick={() => variant === 'patient' ? toggleTaskCompletion(task.id) : null}
                  className={`mt-0.5 flex-shrink-0 size-5 rounded-full flex items-center justify-center border ${
                    task.completed
                      ? 'bg-mood-purple border-mood-purple text-white'
                      : 'border-mood-neutral hover:border-mood-purple'
                  }`}
                >
                  {task.completed && <Check size={12} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Calendar size={12} className="text-muted-foreground" />
                      <span className={`text-xs ${
                        isOverdue(task.dueDate) && !task.completed 
                          ? 'text-destructive' 
                          : isToday(task.dueDate) && !task.completed
                            ? 'text-mood-purple font-medium'
                            : 'text-muted-foreground'
                      }`}>
                        {isToday(task.dueDate) ? 'Today' : formatDate(task.dueDate)}
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${task.completed ? 'text-muted-foreground' : 'text-foreground/80'}`}>
                    {task.description}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            No tasks assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}
