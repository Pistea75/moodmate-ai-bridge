import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '../../components/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard, Session } from '../../components/SessionCard';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { startOfDay, endOfDay, isAfter } from 'date-fns'; // 🗓️ for date handling

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsToday, setSessionsToday] = useState<number>(0);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('role', 'patient');

      if (error) {
        console.error('❌ Error fetching patients:', error);
      } else {
        console.log('✅ Patients:', data);
        setPatients(data || []);
      }
    };

    const fetchSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, scheduled_time, duration_minutes, status, patient_id');

      if (error) {
        console.error('❌ Error fetching sessions:', error);
        return;
      }

      const now = new Date();
      const upcoming = (data || [])
        .filter((session: any) => isAfter(new Date(session.scheduled_time), now))
        .map((session: any) => {
          const patient = patients.find((p) => p.id === session.patient_id);
          return {
            id: session.id,
            title: 'Therapy Session', // You can customize title later
            dateTime: session.scheduled_time,
            duration: session.duration_minutes,
            patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient',
            status: session.status,
          } as Session;
        });

      setUpcomingSessions(upcoming);

      const todaySessions = (data || []).filter((session: any) => {
        const scheduled = new Date(session.scheduled_time);
        return scheduled >= startOfDay(now) && scheduled <= endOfDay(now);
      });

      setSessionsToday(todaySessions.length);
    };

    const loadDashboardData = async () => {
      setLoading(true);
      await fetchPatients();
      await fetchSessions();
      setLoading(false);
    };

    loadDashboardData();
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
            <div className="text-2xl font-bold mt-1">{loading ? '...' : patients.length}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Sessions Today</div>
            <div className="text-2xl font-bold mt-1">{loading ? '...' : sessionsToday}</div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
            <div className="text-2xl font-bold mt-1">5</div> {/* 🔥 Will update dynamically later */}
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
            {loading ? (
              <p>Loading sessions...</p>
            ) : upcomingSessions.length > 0 ? (
              upcomingSessions.map((session) => (
                <SessionCard key={session.id} session={session} variant="clinician" />
              ))
            ) : (
              <p className="text-muted-foreground">No upcoming sessions.</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Spotlight</h2>
              <select className="border rounded-md px-3 py-1 text-sm">
                {patients.map((patient) => (
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

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <a href="/clinician/reports" className="text-sm text-mood-purple hover:underline">
              View All
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div key={patient.id} className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {patient.first_name?.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{patient.first_name} {patient.last_name}</h3>
                    <p className="text-xs text-muted-foreground">Latest report: Apr 20, 2025</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Patient has shown improvement in managing anxiety symptoms through consistent practice of mindfulness techniques. Sleep patterns have stabilized...
                </p>
                <a
                  href={`/clinician/reports/${patient.first_name?.toLowerCase()}-${patient.last_name?.toLowerCase()}`}
                  className="text-mood-purple text-sm font-medium mt-3 inline-block hover:underline"
                >
                  View Full Report
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ClinicianLayout>
  );
}

