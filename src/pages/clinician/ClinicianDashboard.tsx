import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '../../components/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard, Session } from '../../components/SessionCard';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { startOfDay, endOfDay, isAfter } from 'date-fns';

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
        console.log('✅ Visible patients:', data);
        setPatients(data || []);
      }
      setLoading(false);
    };

    const fetchSessionsToday = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, scheduled_time, duration_minutes, status, patient_id')
        .gte('scheduled_time', startOfDay(new Date()).toISOString())
        .lte('scheduled_time', endOfDay(new Date()).toISOString());

      if (error) {
        console.error('❌ Error fetching sessions today:', error);
      } else {
        console.log('✅ Sessions Today:', data);
        setSessionsToday(data.length);
      }
    };

    const fetchUpcomingSessions = async () => {
      const { data, error } = await supabase
        .from('sessions')
        .select('id, scheduled_time, duration_minutes, status, patient_id')
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('❌ Error fetching upcoming sessions:', error);
      } else {
        console.log('✅ Upcoming Sessions:', data);

        // Fetch patient names separately
        const patientIds = data?.map(s => s.patient_id);
        if (patientIds.length > 0) {
          const { data: patientsData } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', patientIds);

          const sessionsWithNames: Session[] = data.map((session: any) => {
            const patient = patientsData?.find(p => p.id === session.patient_id);
            return {
              id: session.id,
              title: 'Therapy Session',
              dateTime: session.scheduled_time,
              duration: session.duration_minutes || 50,
              patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown',
              status: session.status,
            };
          });

          setUpcomingSessions(sessionsWithNames);
        }
      }
    };

    fetchPatients();
    fetchSessionsToday();
    fetchUpcomingSessions();
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
            <div className="text-2xl font-bold mt-1">5</div> {/* We'll update this later */}
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
                  session={session} 
                  variant="clinician"
                />
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No upcoming sessions.</p>
            )}
          </div>
        </div>

        {/* Patient Spotlight + Tasks This Week */}
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
      </div>
    </ClinicianLayout>
  );
}


