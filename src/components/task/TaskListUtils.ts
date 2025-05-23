
import { Task as DatabaseTask } from '@/hooks/useTasks';

// Local Task type with camelCase properties for UI components
export type Task = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

export const isOverdue = (dateString: string) => {
  const today = new Date();
  const dueDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today && !isToday(dateString);
};

export const isToday = (dateString: string) => {
  const today = new Date();
  const dueDate = new Date(dateString);
  return today.toDateString() === dueDate.toDateString();
};

export const filterTasks = (tasks: Task[], showCompleted: boolean = false) => {
  return tasks.filter(task => (showCompleted ? task.completed : !task.completed));
};

export const getEmptyTaskMessage = (showCompleted: boolean) => {
  return showCompleted ? "No completed tasks." : "No active tasks assigned yet.";
};

// Convert database tasks to UI tasks format (snake_case to camelCase)
export const convertDatabaseTasksToUITasks = (dbTasks: DatabaseTask[]): Task[] => {
  return dbTasks.map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    dueDate: task.due_date,
    completed: task.completed
  }));
};
