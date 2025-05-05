
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

    if (userError || !userData?.user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    // Step 1: Get profile by auth UID
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userData.user.id) // this assumes profiles.id === auth.user.id
      .single();

    if (profileError || !profiles) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    // Step 2: Get tasks for this profile ID
    const { data: tasksData, error: taskError } = await supabase
      .from('tasks')
      .select(`
        *,
        profiles:clinician_id(first_name, last_name)
      `)
      .eq('patient_id', profiles.id);

    if (taskError) {
      setError(taskError.message);
    } else {
      setTasks(tasksData || []);
    }

    setLoading(false);
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    await supabase.from('tasks').update({ completed }).eq('id', taskId);
    fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
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

