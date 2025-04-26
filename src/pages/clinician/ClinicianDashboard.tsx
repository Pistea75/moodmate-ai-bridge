import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '../../components/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard, Session } from '../../components/SessionCard';
import ClinicianLayout from '../../layouts/ClinicianLayout';

const upcomingSessions: Session[] = [
  {
    id: '1',
    title: 'Weekly Therapy Session',
    dateTime: '2025-04-27T10:00:00',
    duration: 50,
    patientName: 'Alex Smith',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Initial Assessment',
    dateTime: '2025-04-27T13:30:00',
    duration: 60,
    patientName: 'Jamie Wilson',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Follow-up Discussion',
    dateTime: '2025-04-28T11:00:00',
    duration: 30,
    patientName: 'Taylor Brown',
    status: 'upcoming'
  }
];

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'patient');

      if (!error) {
        setPatients(data || []);
      }
      setLoading(false);
    };

    fetchPatients();
  }, []);

  return (
    <ClinicianLayout>

      {/* 🔥 DEBUG BUTTON START */}
      <button 
        onClick={async () => {
          const { data: userData } = await supabase.auth.getUser();
          console.log('🧠 Logged in as:', userData?.user?.id);

          const { data: profiles, error } = await supabase
            .from('profiles')
            .select('*');

          console.log('👀 Visible profiles:', profiles);
          console.log('❌ Error:', error);
        }}
        style={{
          padding: '10px',
          backgroundColor: '#a855f7',
          color: 'white',
          borderRadius: '6px',
          margin: '20px 0',
          display: 'block'
        }}
      >
        DEBUG: Check Patient Connection
      </button>
      {/* 🔥 DEBUG BUTTON END */}

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
            <div className="text-2xl font-bold mt-1">3</div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
            <div className="text-2xl font-bold mt-1">5</div>
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
            {upcomingSessions.map(session => (
              <SessionCard 
                key={session.id} 
                session={session} 
                variant="clinician"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Spotlight</h2>
              <select className="border rounded-md px-3 py-1 text-sm">
                <option>Alex Smith</option>
                <option>Jamie Wilson</option>
                <option>Taylor Brown</option>
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
            {['Alex Smith', 'Jamie Wilson', 'Taylor Brown'].map((patient) => (
              <div key={patient} className="bg-white rounded-xl border p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {patient.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium">{patient}</h3>
                    <p className="text-xs text-muted-foreground">Latest report: Apr 20, 2025</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  Patient has shown improvement in managing anxiety symptoms through consistent practice of mindfulness techniques. Sleep patterns have stabilized...
                </p>
                <a 
                  href={`/clinician/reports/${patient.toLowerCase().replace(' ', '-')}`}
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
