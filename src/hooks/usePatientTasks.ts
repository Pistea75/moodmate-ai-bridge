
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string;
  due_date: string;
  completed: boolean;
  patient_id: string;
}

export function usePatientTasks(patientId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  
  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Fetch tasks function with proper patientId handling
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the current user if patientId is not provided (for patient's own view)
      let userId = patientId;
      
      if (!userId) {
        const { data: userData } = await supabase.auth.getUser();
        userId = userData?.user?.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }
      }
      
      const { data, error: supabaseError } = await supabase
        .from('tasks')
        .select('*')
        .eq('patient_id', userId)
        .order('due_date', { ascending: true });
          
      if (supabaseError) throw new Error(supabaseError.message);

      // Sort tasks: incomplete first, then by closest due date
      const sortedTasks = (data || []).sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1; // incomplete first
        }
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      });
      
      setTasks(sortedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: err instanceof Error ? err.message : 'Failed to load tasks',
      });
    } finally {
      setLoading(false);
    }
  }, [patientId, toast]);

  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: string, newValue: boolean) => {
    try {
      // Update local state immediately for better UI responsiveness
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, completed: newValue } : task
        )
      );
      
      const { error: updateError } = await supabase
        .from('tasks')
        .update({ completed: newValue })
        .eq('id', taskId);
      
      if (updateError) throw new Error(updateError.message);
      
      toast({
        title: `Task marked as ${newValue ? 'completed' : 'incomplete'}`,
        description: "Task status updated successfully",
      });
    } catch (err) {
      console.error('Error updating task completion:', err);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
      
      // Revert the local state change if the server update failed
      await fetchTasks();
    }
  };

  // Delete task function
  const deleteTask = async (taskId: string) => {
    try {
      // Update local state immediately for better UI responsiveness
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);
      
      if (deleteError) throw new Error(deleteError.message);
      
      toast({
        title: "Task deleted",
        description: "Task has been removed successfully",
      });
    } catch (err) {
      console.error('Error deleting task:', err);
      toast({
        variant: "destructive",
        title: "Failed to delete task",
        description: err instanceof Error ? err.message : 'An unexpected error occurred',
      });
      
      // Revert the local state change if the server delete failed
      await fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, error, formatDate, toggleTaskCompletion, deleteTask, fetchTasks };
}
