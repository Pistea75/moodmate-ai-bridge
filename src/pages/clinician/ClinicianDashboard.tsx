
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MoodChart } from '../../components/mood/MoodChart';
import { TaskList } from '../../components/TaskList';
import { SessionCard } from '../../components/SessionCard';
import { Skeleton } from "@/components/ui/skeleton";
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { startOfDay, endOfDay, isAfter } from 'date-fns';
import { useClinicianTasks } from '@/hooks/useClinicianTasks';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ClinicianDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [sessionsToday, setSessionsToday] = useState<any[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showAddTaskDialog, setShowAddTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });

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

    fetchPatients();
    fetchSessionsToday();
  }, []);

  const upcomingSessions = sessionsToday.filter(
    (session: any) => isAfter(new Date(session.scheduled_time), new Date())
  );

  const handleAddTask = async () => {
    if (!newTask.title) return;
    
    await addTask(
      newTask.title, 
      newTask.description, 
      newTask.dueDate || new Date().toISOString().split('T')[0]
    );
    
    setNewTask({ title: '', description: '', dueDate: '' });
    setShowAddTaskDialog(false);
  };

  const formatTasksForComponent = (tasks: any[]) => {
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description || '',
      dueDate: task.dueDate,
      completed: task.completed
    }));
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">

        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold">Welcome, Dr. Johnson</h1>
          <p className="text-muted-foreground">Here's your practice overview for today</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Total Patients</div>
            <div className="text-2xl font-bold mt-1">
              {loadingPatients ? <Skeleton className="h-8 w-16" /> : patients.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Sessions Today</div>
            <div className="text-2xl font-bold mt-1">
              {loadingSessions ? <Skeleton className="h-8 w-16" /> : sessionsToday.length}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl border">
            <div className="text-sm text-muted-foreground">Pending Tasks</div>
            <div className="text-2xl font-bold mt-1">
              {loadingTasks ? <Skeleton className="h-8 w-16" /> : tasks.filter(t => !t.completed).length}
            </div>
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Upcoming Sessions</h2>
            <a href="/clinician/sessions" className="text-sm text-mood-purple hover:underline">View All</a>
          </div>

          {loadingSessions ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, idx) => (
                <Skeleton key={idx} className="h-24 w-full rounded-lg" />
              ))}
            </div>
          ) : upcomingSessions.length > 0 ? (
            <div className="space-y-4">
              {upcomingSessions.map((session: any) => (
                <SessionCard
                  key={session.id}
                  session={{
                    id: session.id,
                    title: 'Therapy Session',
                    dateTime: session.scheduled_time,
                    duration: session.duration_minutes,
                    patientName: `${session.patient.first_name} ${session.patient.last_name}`,
                    status: 'upcoming'
                  }}
                  variant="clinician"
                />
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground text-sm">No upcoming sessions.</div>
          )}
        </div>

        {/* Spotlight and Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Patient Spotlight</h2>
              <select 
                className="border rounded-md px-3 py-1 text-sm"
                value={selectedPatient || ''}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </select>
            </div>
            {selectedPatient ? (
              <MoodChart patientId={selectedPatient} />
            ) : (
              <div className="bg-white rounded-xl shadow-sm border p-4 w-full h-64 flex items-center justify-center text-muted-foreground">
                Select a patient to view their mood data
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Tasks</h2>
              <Button 
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                onClick={() => setShowAddTaskDialog(true)}
              >
                <PlusCircle size={16} />
                <span>Add Task</span>
              </Button>
            </div>
            
            {loadingTasks ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="h-20 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <TaskList 
                variant="clinician" 
                patientName="Clinician"
                tasks={formatTasksForComponent(tasks)}
                onTaskUpdate={(taskId, completed) => updateTaskCompletion(taskId.toString(), completed)}
              />
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Reports</h2>
            <a href="/clinician/reports" className="text-sm text-mood-purple hover:underline">View All</a>
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
                  Patient has shown improvement in managing anxiety symptoms through consistent practice of mindfulness techniques.
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

      {/* Add Task Dialog */}
      <Dialog open={showAddTaskDialog} onOpenChange={setShowAddTaskDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Personal Task</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Enter task details (optional)"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTaskDialog(false)}>Cancel</Button>
            <Button onClick={handleAddTask} disabled={!newTask.title}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ClinicianLayout>
  );
}
