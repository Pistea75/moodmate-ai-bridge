
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PatientTask {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  patient_id: string;
  clinician_id: string;
  clinician?: {
    first_name: string | null;
    last_name: string | null;
  };
}

export function usePatientTasks() {
  const [tasks, setTasks] = useState<PatientTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    const patientId = userData.user.id;
    console.log("Patient ID:", patientId);

    const { data: tasksData, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        clinician:profiles!clinician_id (first_name, last_name)
      `)
      .eq('patient_id', patientId);

    if (taskError) {
      setError(taskError.message);
      console.error("Supabase query error:", taskError);
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: taskError.message || 'An unexpected error occurred',
      });
    } else {
      console.log("Fetched tasks:", tasksData);
      setTasks(tasksData ?? []);
    }

    setLoading(false);
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);
      
      if (updateError) throw new Error(updateError.message);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );

      await fetchTasks();

      toast({
        title: `Task marked as ${completed ? 'completed' : 'incomplete'}`,
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

  const deleteTask = async (taskId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (deleteError) throw new Error(deleteError.message);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      });
    } catch (err: any) {
      console.error('Error deleting task:', err.message);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: err.message || 'An unexpected error occurred',
      });
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    toggleTaskCompletion,
    deleteTask,
  };
}
