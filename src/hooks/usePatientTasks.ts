
import { useEffect, useState, useCallback } from 'react';
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

  const fetchTasks = useCallback(async () => {
    try {
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
    } catch (err: any) {
      console.error('Error in fetchTasks:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      console.log(`Toggling task ${taskId} to ${completed ? 'completed' : 'incomplete'}`);
      
      // First update local state for immediate UI feedback
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed } : task
        )
      );
      
      // Log the request details for debugging
      console.log(`Sending update to Supabase for task ${taskId}, setting completed to ${completed}`);
      
      // Update in the database WITHOUT select() - don't expect data back
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);
      
      if (updateError) {
        console.error("Error updating task:", updateError);
        throw new Error(updateError.message);
      }
      
      toast({
        title: `Task marked as ${completed ? 'completed' : 'incomplete'}`,
        description: "Task status updated successfully",
      });
      
      // No need to await fetchTasks here - the optimistic UI update handles it
    } catch (err: any) {
      console.error('Error updating task completion:', err.message);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: err.message || 'An unexpected error occurred',
      });
      
      // Revert the local state change if the server update failed
      await fetchTasks();
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      console.log(`Deleting task ${taskId}`);
      
      // Update local state immediately for better UI responsiveness
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Then delete from database
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (deleteError) {
        console.error("Error deleting task:", deleteError);
        throw new Error(deleteError.message);
      }
      
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      });
      
      // Refresh tasks from server to ensure we're in sync
      await fetchTasks();
    } catch (err: any) {
      console.error('Error deleting task:', err.message);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: err.message || 'An unexpected error occurred',
      });
      
      // Revert the local state change if the server delete failed
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    toggleTaskCompletion,
    deleteTask,
    fetchTasks
  };
}
