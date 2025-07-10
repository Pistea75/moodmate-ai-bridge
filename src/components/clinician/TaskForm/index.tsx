
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskFormFields } from './TaskFormFields';
import { useTaskForm } from './useTaskForm';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  patient_id?: string;
  clinician_id: string;
}

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  task?: Task | null;
}

const taskCategories = [
  'Assessment',
  'CBT',
  'Coping Skills',
  'Education',
  'Goal Setting',
  'Homework',
  'Mindfulness',
  'Social Skills',
  'Treatment Planning',
  'Other'
];

export function TaskForm({ open, onClose, onTaskCreated, task }: TaskFormProps) {
  const { 
    formData, 
    setFormData, 
    patients, 
    loading, 
    dueDate, 
    setDueDate, 
    handleSubmit 
  } = useTaskForm(task, onTaskCreated, onClose);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <TaskFormFields
            formData={formData}
            setFormData={setFormData}
            patients={patients}
            dueDate={dueDate}
            setDueDate={setDueDate}
            taskCategories={taskCategories}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
