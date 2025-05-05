
import { format } from 'date-fns';
import { Clock, Trash2 } from 'lucide-react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from '@/components/ui/skeleton';
import { usePatientTasks } from '@/hooks/usePatientTasks';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function PatientTasks() {
  const { tasks, loading, error, toggleTaskCompletion, deleteTask } = usePatientTasks();

  // 🔍 Debug logs
  console.log('Tasks from hook:', tasks);
  console.log('Loading:', loading);
  console.log('Error:', error);

  // Function to check if a task is overdue
  const isOverdue = (dateString: string, completed: boolean) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today && !completed;
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Tasks</h1>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-2" />
                    <div className="flex items-center gap-4 mt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {tasks.length === 0 && (
              <div className="text-center py-8 bg-muted/30 rounded-lg border border-muted">
                <p className="text-muted-foreground">No tasks assigned yet.</p>
              </div>
            )}

            {tasks.map((task) => (
              <Card key={task.id} className={`p-4 ${isOverdue(task.due_date, task.completed) ? 'border-destructive/40' : ''}`}>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(val) => toggleTaskCompletion(task.id, Boolean(val))}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span className={`flex items-center gap-1 ${isOverdue(task.due_date, task.completed) ? 'text-destructive font-medium' : 'text-muted-foreground'}`}>
                        <Clock className="h-4 w-4" />
                        Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                        {isOverdue(task.due_date, task.completed) && " (overdue)"}
                      </span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        Assigned by: {task.profiles?.first_name} {task.profiles?.last_name}
                      </span>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete task</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this task. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTask(task.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}
