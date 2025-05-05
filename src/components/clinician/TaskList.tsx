
import { format } from 'date-fns';
import { Clock, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  patient_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface TaskListProps {
  tasks: Task[];
  onToggleCompleted: (taskId: string, completed: boolean) => void;
  onEditTask: (task: Task) => void;
}

export function TaskList({ tasks, onToggleCompleted, onEditTask }: TaskListProps) {
  // Function to check if a task is overdue
  const isOverdue = (dateString: string, completed: boolean) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !completed;
  };

  return (
    <div className="grid gap-4">
      {tasks.length === 0 && (
        <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
          <p className="text-muted-foreground">No tasks found. Create your first task to get started!</p>
        </div>
      )}
      
      {tasks.map((task) => (
        <Card key={task.id} className={`p-4 ${isOverdue(task.due_date, task.completed) ? 'border-destructive/40' : ''}`}>
          <div className="flex items-start gap-4">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(val) => onToggleCompleted(task.id, Boolean(val))}
              className="mt-1"
            />
            <div className="flex-1">
              <h3
                className={`font-medium ${
                  task.completed ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span className={`flex items-center gap-1 ${
                  isOverdue(task.due_date, task.completed) ? 'text-destructive font-medium' : 'text-muted-foreground'
                }`}>
                  <Clock className="h-4 w-4" />
                  Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                  {isOverdue(task.due_date, task.completed) && " (overdue)"}
                </span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">
                  Patient: {task.profiles?.first_name} {task.profiles?.last_name}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEditTask(task)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit task</span>
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
