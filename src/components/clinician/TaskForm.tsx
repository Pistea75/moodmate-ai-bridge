
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PatientSelector } from '@/components/session/PatientSelector';

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

      if (error) return console.error('Update failed:', error.message);
    } else {
      const { error } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        completed: false,
        patient_id: formData.patient_id,
        clinician_id: user.user?.id,
      });

      if (error) return console.error('Create failed:', error.message);
    }

    onSave();
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold">
          {isEdit ? 'Edit Task' : 'Create New Task'}
        </DialogTitle>
      </DialogHeader>
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
          disabled={!formData.title || !formData.patient_id || !formData.due_date}
        >
          {isEdit ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </DialogContent>
  );
}
