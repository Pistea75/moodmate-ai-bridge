
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePatientTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      setError('Unable to retrieve user.');
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // Get the profile.id that maps to this auth.user.id
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      setError('Profile not found.');
      setLoading(false);
      return;
    }

    const { data, error: tasksError } = await supabase
      .from('tasks')
      .select('*, profiles:clinician_id(first_name, last_name)')
      .eq('patient_id', profile.id)
      .order('due_date', { ascending: true });

    if (tasksError) {
      setError('Error fetching tasks.');
      setLoading(false);
      return;
    }

    setTasks(data || []);
    setLoading(false);
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId);

    if (!error) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed } : task
        )
      );
    }
  };

  const deleteTask = async (taskId: number) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (!error) {
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
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
