
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientTask {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  clinician_id: string;
  profiles?: {
    first_name: string;
    last_name: string;
  };
}

export function usePatientTasks() {
  const [tasks, setTasks] = useState<PatientTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          description,
          due_date,
          completed,
          patient_id,
          clinician_id,
          inserted_at,
          profiles!tasks_clinician_id_fkey(first_name, last_name)
        `)
        .eq('patient_id', user.user?.id);

      if (error) throw new Error(error.message);
      
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching patient tasks:', err.message);
      setError('Failed to load tasks. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: err.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleTaskCompletion = async (taskId: string, newValue: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: newValue })
        .eq('id', taskId);
      
      if (error) throw new Error(error.message);
      
      await fetchTasks();
      toast({
        title: `Task marked as ${newValue ? 'completed' : 'incomplete'}`,
        description: "Task status updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating task completion:', err.message);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: err.message || 'An unexpected error occurred',
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    toggleTaskCompletion
  };
}
