
import { Check, Calendar } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskItemProps {
  task: {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    completed: boolean;
  };
  variant: 'patient' | 'clinician';
  toggleTaskCompletion: (taskId: string) => void;
  formatDate: (dateString: string) => string;
  isOverdue: (dateString: string) => boolean;
  isToday: (dateString: string) => boolean;
}

export function TaskItem({ 
  task,
  variant,
  toggleTaskCompletion,
  formatDate,
  isOverdue,
  isToday
}: TaskItemProps) {
  return (
    <div 
      className={`p-3 rounded-lg border ${task.completed ? 'bg-muted/50 border-muted' : 'bg-white border-muted'}`}
    >
      <div className="flex items-start gap-3">
        {variant === 'clinician' ? (
          <Checkbox
            checked={task.completed} 
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className="mt-0.5"
          />
        ) : (
          <button 
            onClick={() => toggleTaskCompletion(task.id)} 
            className={`mt-0.5 flex-shrink-0 size-5 rounded-full flex items-center justify-center border ${
              task.completed ? 'bg-mood-purple border-mood-purple text-white' : 'border-mood-neutral hover:border-mood-purple'
            }`}
          >
            {task.completed && <Check size={12} />}
          </button>
        )}

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
  );
}
