
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePatientTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks =import { useEffect, useState } from 'react';
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
        profiles:clinician_id(first_name, last_name)
      `)
      .eq('patient_id', patientId);

    if (taskError) {
      setError(taskError.message);
      console.error("Supabase query error:", taskError);
    } else {
      console.log("Fetched tasks:", tasksData);
      setTasks(tasksData ?? []);
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
    deleteTask,
  };
}

