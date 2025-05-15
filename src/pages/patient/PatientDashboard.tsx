import { MoodChart } from '../../components/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard, Session } from '../../components/SessionCard';
import PatientLayout from '../../layouts/PatientLayout';
import MoodLogModal from '../../components/MoodLogModal';

// Sample upcoming sessions
const upcomingSessions: Session[] = [
  {
    id: '1',
    title: 'Weekly Therapy Session',
    dateTime: '2025-04-28T13:00:00',
    duration: 50,
    clinicianName: 'Dr. Sarah Johnson',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Follow-up Discussion',
    dateTime: '2025-05-05T15:30:00',
    duration: 30,
    clinicianName: 'Dr. Sarah Johnson',
    status: 'upcoming'
  }
];

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, Alex</h1>
            <p className="text-muted-foreground">Here's your mental wellness summary</p>
          </div>
          <MoodLogModal />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MoodChart />
          </div>
          <div>
            <TaskList />
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
            {upcomingSessions.length > 0 ? (
              upcomingSessions.map(session => (
                <SessionCard 
                  key={session.id} 
                  session={session} 
                  variant="patient"
                />
              ))
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border">
                <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
                <button className="mt-3 px-4 py-2 bg-mood-purple text-white rounded-lg text-sm">
                  Schedule a Session
                </button>
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
