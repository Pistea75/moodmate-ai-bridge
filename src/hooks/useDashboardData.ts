
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, isAfter } from 'date-fns';
import { useClinicianTasks } from '@/hooks/useClinicianTasks';

export function useDashboardData() {
  console.log('🔄 useDashboardData hook initializing');
  
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
    console.log('🔄 useDashboardData useEffect triggered');
    
    const fetchPatients = async () => {
      try {
        console.log('📝 Fetching patients...');
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .eq('role', 'patient');
        
        if (error) {
          console.error('❌ Error fetching patients:', error);
        } else {
          console.log('✅ Patients fetched:', data?.length || 0);
          setPatients(data || []);
          if (data && data.length > 0) {
            setSelectedPatient(data[0].id);
          }
        }
      } catch (error) {
        console.error('❌ Exception fetching patients:', error);
      } finally {
        setLoadingPatients(false);
      }
    };

    const fetchSessionsToday = async () => {
      try {
        console.log('📅 Fetching sessions...');
        const { data, error } = await supabase
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
        
        if (error) {
          console.error('❌ Error fetching sessions:', error);
        } else {
          console.log('✅ Sessions fetched:', data?.length || 0);
          setSessionsToday(data || []);
        }
      } catch (error) {
        console.error('❌ Exception fetching sessions:', error);
      } finally {
        setLoadingSessions(false);
      }
    };

    const fetchClinicianProfile = async () => {
      try {
        console.log('👤 Fetching clinician profile...');
        const { data: user } = await supabase.auth.getUser();
        if (user?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', user.user.id)
            .single();
          
          if (error) {
            console.error('❌ Error fetching clinician profile:', error);
          } else if (profile) {
            console.log('✅ Clinician profile fetched:', profile);
            setClinicianName(profile.first_name || '');
          }
        }
      } catch (error) {
        console.error('❌ Exception fetching clinician profile:', error);
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

  console.log('📊 useDashboardData returning:', {
    patients: patients.length,
    sessionsToday: sessionsToday.length,
    upcomingSessions: upcomingSessions.length,
    tasks: tasks.length,
    clinicianName
  });

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
