
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePatientTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    // Step 1: Get the authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // Step 2: Get the matching profile for this user
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileError || !profile) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    // Step 3: Fetch tasks assigned to the profile ID
    const { data, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        profiles:clinician_id(first_name, last_name)
      `)
      .eq('patient_id', profile.id);

    if (taskError) {
      setError(taskError.message);
    } else {
      setTasks(data || []);
    }

    setLoading(false);
  };

  const toggleTaskCompletion = async (taskId: number, completed: boolean) => {
    await supabase.from('tasks').update({ completed }).eq('id', taskId);
    fetchTasks();
  };

  const deleteTask = async (taskId: number) => {
    await supabase.from('tasks').delete().eq('id', taskId);
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    toggleTaskCompletion,
    deleteTask
  };
}

