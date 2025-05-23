
import { useState, useEffect } from 'react';
import { MoodChart } from '../../components/mood/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard } from '../../components/SessionCard';
import PatientLayout from '../../layouts/PatientLayout';
import { MoodLogModal } from '../../components/patient/MoodLogModal';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientTasks } from '@/hooks/usePatientTasks';
import { usePatientSessions } from '@/hooks/usePatientSessions';
import { Skeleton } from '@/components/ui/skeleton';
import { MoodStatsCard } from '@/components/patient/MoodStatsCard';
import { TasksCompletedCard } from '@/components/patient/TasksCompletedCard';

export default function PatientDashboard() {
  const { user } = useAuth();
  const [patientName, setPatientName] = useState('');
  
  // Get patient tasks using the hook
  const { tasks, loading: tasksLoading } = usePatientTasks();
  
  // Get patient sessions using the hook
  const { pastSession, upcomingSession, loading: sessionsLoading } = usePatientSessions(user?.id || '');
  
  // Get upcoming sessions only
  const upcomingSessions = upcomingSession ? [upcomingSession] : [];

  useEffect(() => {
    const fetchPatientProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('first_name')
            .eq('id', user.id)
            .single();
          
          if (error) {
            console.error('Error fetching patient profile:', error);
            return;
          }
          
          if (data?.first_name) {
            setPatientName(data.first_name);
          }
        } catch (error) {
          console.error('Error in fetchPatientProfile:', error);
        }
      }
    };
    
    fetchPatientProfile();
  }, [user]);

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {patientName || 'Patient'}</h1>
            <p className="text-muted-foreground">Here's your mental wellness summary</p>
          </div>
          <MoodLogModal />
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MoodStatsCard />
          <TasksCompletedCard />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MoodChart />
          </div>
          <div>
            <TaskList 
              variant="patient" 
              tasks={tasks.map(task => ({
                id: task.id,
                title: task.title,
                dueDate: task.due_date,
                completed: task.completed,
                description: task.description
              }))}
              loading={tasksLoading}
            />
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <a href="/patient/sessions" className="text-sm text-mood-purple hover:underline">
              View All
            </a>
          </div>
          
          <div className="space-y-4">
            {sessionsLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard 
                  key={session.id} 
                  session={{
                    id: session.id,
                    title: "Therapy Session",
                    dateTime: session.scheduled_time,
                    duration: session.duration_minutes,
                    status: 'upcoming'
                  }} 
                  variant="patient"
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border">
                <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                <a href="/patient/sessions">
                  <button className="mt-3 px-4 py-2 bg-mood-purple text-white rounded-lg text-sm">
                    Schedule a Session
                  </button>
                </a>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">AI Companion</h2>
          </div>
          
          <div className="bg-white rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-mood-purple-light flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#9b87f5"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v1h6V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 5a7 7 0 0 0-14 0"></path>
                  <path d="M5 5v14a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V5"></path>
                  <path d="M12 10v4"></path>
                  <path d="M12 18h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Continue your conversation</h3>
                <p className="text-muted-foreground text-sm">
                  Your AI companion is here to support you whenever you need it.
                </p>
              </div>
              <div className="ml-auto">
                <a 
                  href="/patient/chat" 
                  className="px-4 py-2 bg-mood-purple text-white rounded-lg text-sm font-medium"
                >
                  Chat Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}
