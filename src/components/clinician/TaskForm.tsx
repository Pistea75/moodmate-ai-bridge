
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PatientSelector } from '@/components/session/PatientSelector';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface TaskFormProps {
  isEdit: boolean;
  initialTask?: {
    id: string | null;
    title: string;
    description: string;
    due_date: string;
    patient_id: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

export function TaskForm({ isEdit, initialTask, onSave, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState({
    id: null as string | null,
    title: '',
    description: '',
    due_date: '',
    patient_id: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialTask) {
      setFormData({
        id: initialTask.id,
        title: initialTask.title,
        description: initialTask.description,
        due_date: initialTask.due_date,
        patient_id: initialTask.patient_id,
      });
    }
  }, [initialTask]);

  const handleCreateOrUpdateTask = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();

      if (isEdit && formData.id) {
        const { error } = await supabase
          .from('tasks')
          .update({
            title: formData.title,
            description: formData.description,
            due_date: formData.due_date,
            patient_id: formData.patient_id,
          })
          .eq('id', formData.id)
          .eq('clinician_id', user.user?.id);

        if (error) throw new Error(error.message);
        
        toast({
          title: "Task updated",
          description: "The task has been updated successfully",
        });
      } else {
        const { error } = await supabase.from('tasks').insert({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          completed: false,
          patient_id: formData.patient_id,
          clinician_id: user.user?.id,
        });

        if (error) throw new Error(error.message);
        
        toast({
          title: "Task created",
          description: "The new task has been created successfully",
        });
      }

      onSave();
    } catch (err: any) {
      console.error(isEdit ? 'Update failed:' : 'Create failed:', err.message);
      setError(err.message || 'An unexpected error occurred');
      toast({
        variant: "destructive",
        title: isEdit ? "Failed to update task" : "Failed to create task",
        description: err.message || 'An unexpected error occurred',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
      </DialogHeader>
      
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4 p-4">
        {/* Patient Selection - First */}
        <div className="space-y-2">
          <PatientSelector 
            value={formData.patient_id} 
            onChange={(value) => setFormData({ ...formData, patient_id: value })}
          />
        </div>
        
        {/* Title - Second */}
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Task title"
          />
        </div>
        
        {/* Description - Third */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Task description"
            className="min-h-[100px]"
          />
        </div>
        
        {/* Due Date - Fourth */}
        <div className="space-y-2">
          <Label htmlFor="due_date">Due Date</Label>
          <Input
            id="due_date"
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>
        
        <Button 
          className="w-full mt-6" 
          onClick={handleCreateOrUpdateTask}
          disabled={isSubmitting || !formData.title || !formData.patient_id || !formData.due_date}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEdit ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            isEdit ? 'Update Task' : 'Create Task'
          )}
        </Button>
      </div>
    </DialogContent>
  );
}
