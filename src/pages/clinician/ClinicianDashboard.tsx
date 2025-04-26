import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '../../components/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard } from '../../components/SessionCard';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { startOfDay, endOfDay, isAfter } from 'date-fns';

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'patient');

      if (error) {
        console.error('❌ Error fetching patients:', error);
      } else {
        setPatients(data || []);
      }
    };

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          patient_id,
          profiles!sessions_patient_id_fkey(first_name, last_name)
        `)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching sessions:', error);
      } else {
        const now = new Date();
        const upcoming = (data || []).filter(session =>
          isAfter(new Date(session.scheduled_time), now)
        );
        setUpcomingSessions(upcoming);

        // Filter sessions that are today
        const todaySessions = (data || []).filter(session => {
          const sessionDate = new Date(session.scheduled_time);
          return (
            sessionDate >= startOfDay(new Date()) &&
            sessionDate <= endOfDay(new Date())
          );
        });

        setSessionsToday(todaySessions.length);
      }
      setLoading(false);
    };

    fetchPatients();
    fetchSessions();
  }, []);

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome, Dr. Johnson</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Total Patients</div>
            <div className="text-2xl font-bold mt-1">
              {loading ? '...' : patients.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Sessions Today</div>
            <div className="text-2xl font-bold mt-1">
              {loading ? '...' : sessionsToday}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
            <div className="text-2xl font-bold mt-1">5</div> {/* We'll wire this later */}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <a href="/clinician/sessions" className="text-sm text-mood-purple hover:underline">
              View All
            </a>
          </div>

          <div className="space-y-4">
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard
                  key={session.id}
                  session={{
                    id: session.id,
                    title: "Therapy Session",
                    dateTime: session.scheduled_time,
                    duration: session.duration_minutes,
                    patientName: `${session.profiles.first_name} ${session.profiles.last_name}`,
                    status: 'upcoming'
                  }}
                  variant="clinician"
                />
              ))
            ) : (
              <div className="text-sm text-muted-foreground">No upcoming sessions.</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Spotlight</h2>
              <select className="border rounded-md px-3 py-1 text-sm">
                {patients.map(patient => (
                  <option key={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
            </div>
            <MoodChart />
          </div>

          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Tasks This Week</h2>
            </div>
            <TaskList variant="clinician" patientName="Alex Smith" />
          </div>
        </div>
      </div>
    </ClinicianLayout>
  );
}



