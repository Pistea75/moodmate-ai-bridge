
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, isAfter } from 'date-fns';
import { useClinicianTasks } from '@/hooks/useClinicianTasks';

export function useDashboardData() {
  const [patients, setPatients] = useState<any[]>([]);
  const [sessionsToday, setSessionsToday] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [clinicianName, setClinicianName] = useState('');

  const {
    tasks,
    loading: loadingTasks,
    updateTaskCompletion,
    addTask,
  } = useClinicianTasks();

  useEffect(() => {
    const fetchPatients = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'patient');
      
      setPatients(data || []);
      if (data && data.length > 0) {
        setSelectedPatient(data[0].id);
      }
      setLoadingPatients(false);
    };

    const fetchSessionsToday = async () => {
      const { data } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          patient:patient_id (
            id,
            first_name,
            last_name
          )
        `)
        .gte('scheduled_time', startOfDay(new Date()).toISOString())
        .lte('scheduled_time', endOfDay(new Date()).toISOString());
      
      setSessionsToday(data || []);
      setLoadingSessions(false);
    };

    const fetchClinicianProfile = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', data.user.id)
          .single();
        
        if (profile) {
          setClinicianName(profile.first_name || '');
        }
      }
    };

    fetchPatients();
    fetchSessionsToday();
    fetchClinicianProfile();
  }, []);

  const upcomingSessions = sessionsToday.filter(
    (session: any) => isAfter(new Date(session.scheduled_time), new Date())
  );

  const formatTasksForComponent = (tasks: any[]) => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      completed: task.completed
    }));
  };

  return {
    patients,
    sessionsToday,
    upcomingSessions,
    selectedPatient,
    setSelectedPatient,
    loadingPatients,
    loadingSessions,
    tasks,
    loadingTasks,
    clinicianName,
    updateTaskCompletion,
    addTask,
    formatTasksForComponent,
    pendingTaskCount: tasks.filter(t => !t.completed).length
  };
}
