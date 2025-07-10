
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

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

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface TaskFormData {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  patient_id: string;
}

export function useTaskForm(task?: Task | null, onTaskCreated?: () => void, onClose?: () => void) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    category: '',
    patient_id: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority,
        category: task.category || '',
        patient_id: task.patient_id || ''
      });
      if (task.due_date) {
        setDueDate(new Date(task.due_date));
      }
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        category: '',
        patient_id: ''
      });
      setDueDate(undefined);
    }
  }, [task]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const { data: links, error: linksError } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', currentUser.user.id);

      if (linksError) throw linksError;

      if (!links || links.length === 0) {
        setPatients([]);
        return;
      }

      const patientIds = links.map(link => link.patient_id).filter(Boolean);
      
      const { data: patientsData, error: patientsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', patientIds)
        .eq('role', 'patient');

      if (patientsError) throw patientsError;

      setPatients(patientsData || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task title',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const taskData = {
        ...formData,
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        clinician_id: currentUser.user.id,
        patient_id: formData.patient_id || null
      };

      if (task) {
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task updated successfully'
        });
      } else {
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task created successfully'
        });
      }

      onTaskCreated?.();
      onClose?.();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save task',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    patients,
    loading,
    dueDate,
    setDueDate,
    handleSubmit
  };
}
