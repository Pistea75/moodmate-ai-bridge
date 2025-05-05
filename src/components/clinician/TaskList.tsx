
import { format } from 'date-fns';
import { Clock, Pencil } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

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
  return (
    <div className="grid gap-4">
      {tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks found.</p>
      )}
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
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
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Due: {format(new Date(task.due_date), 'yyyy-MM-dd')}
                </span>
                <span>•</span>
                <span>
                  Patient: {task.profiles?.first_name} {task.profiles?.last_name}
                </span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onEditTask(task)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
