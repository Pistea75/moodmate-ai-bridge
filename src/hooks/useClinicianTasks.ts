
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClinicianTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

export function useClinicianTasks() {
  const [tasks, setTasks] = useState<ClinicianTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Convert database tasks to our internal format
  const formatTasks = (dbTasks: any[]) => {
    return dbTasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.due_date,
      completed: task.completed || false
    }));
  };

  const fetchClinicianTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error("Not authenticated");
      }

      // Fetch tasks where clinician_id = current user and patient_id is null
      // These are tasks for the clinician themselves, not assigned to patients
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('clinician_id', user.user.id)
        .is('patient_id', null);

      if (error) throw new Error(error.message);
      
      setTasks(formatTasks(data || []));
    } catch (err: any) {
      console.error('Error fetching clinician tasks:', err.message);
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

  const updateTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      // Update local state for immediate feedback
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );
      
      // Update in the database
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);
      
      if (error) throw new Error(error.message);
      
      toast({
        title: `Task marked as ${completed ? 'completed' : 'incomplete'}`,
        description: "Status updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: err.message || 'An unexpected error occurred',
      });
      
      // Revert the local state change
      await fetchClinicianTasks();
    }
  };

  const addTask = async (title: string, description: string, dueDate: string) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error("Not authenticated");
      }
      
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          due_date: dueDate,
          clinician_id: user.user.id,
          patient_id: null, // Explicitly null for clinician's own tasks
          completed: false
        })
        .select();
      
      if (error) throw new Error(error.message);
      
      // Refresh the task list
      await fetchClinicianTasks();
      
      toast({
        title: "Task added",
        description: "New task created successfully",
      });
    } catch (err: any) {
      console.error('Error adding task:', err);
      toast({
        variant: "destructive",
        title: "Failed to add task",
        description: err.message || 'An unexpected error occurred',
      });
    }
  };

  useEffect(() => {
    fetchClinicianTasks();
  }, [fetchClinicianTasks]);

  return {
    tasks,
    loading,
    error,
    updateTaskCompletion,
    addTask,
    fetchClinicianTasks
  };
}
