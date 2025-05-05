
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ClinicianLayout from '@/layouts/ClinicianLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/clinician/TaskForm';
import { TaskList } from '@/components/clinician/TaskList';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    title: '',
    description: '',
    due_date: '',
    patient_id: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: user } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('tasks')
        .select('*, profiles:patient_id(first_name, last_name)')
        .eq('clinician_id', user.user?.id);

      if (error) throw new Error(error.message);
      
      setTasks(data || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err.message);
      setError('Failed to load tasks. Please try again later.');
      toast({
        variant: "destructive",
        title: "Error loading tasks",
        description: err.message || 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompleted = async (taskId: string, newValue: boolean) => {
    try {
      const { error } = await supabase.from('tasks').update({ completed: newValue }).eq('id', taskId);
      
      if (error) throw new Error(error.message);
      
      await fetchTasks();
      toast({
        title: `Task marked as ${newValue ? 'completed' : 'incomplete'}`,
        description: "Task status updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating task completion:', err.message);
      toast({
        variant: "destructive",
        title: "Failed to update task",
        description: err.message || 'An unexpected error occurred',
      });
    }
  };

  const openEditModal = (task: any) => {
    setFormData({
      id: task.id,
      title: task.title,
      description: task.description,
      due_date: task.due_date?.slice(0, 10),
      patient_id: task.patient_id,
    });
    setIsEdit(true);
    setShowDialog(true);
  };

  const handleSaveTask = async () => {
    setFormData({ id: null, title: '', description: '', due_date: '', patient_id: '' });
    setIsEdit(false);
    setShowDialog(false);
    await fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    `${task.profiles?.first_name ?? ''} ${task.profiles?.last_name ?? ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Filter by patient name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setFormData({ id: null, title: '', description: '', due_date: '', patient_id: '' });
                    setIsEdit(false);
                    setShowDialog(true);
                  }}
                >
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <TaskForm
                isEdit={isEdit}
                initialTask={formData}
                onSave={handleSaveTask}
                onCancel={() => setShowDialog(false)}
              />
            </Dialog>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-4/5 mb-2" />
                    <div className="flex items-center gap-4 mt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-2" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <TaskList 
            tasks={filteredTasks}
            onToggleCompleted={handleToggleCompleted}
            onEditTask={openEditModal}
          />
        )}
      </div>
    </ClinicianLayout>
  );
};

export default TasksPage;
