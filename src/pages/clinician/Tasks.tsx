
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

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
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

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('tasks')
      .select('*, profiles:patient_id(first_name, last_name)')
      .eq('clinician_id', user.user?.id);

    if (error) console.error('Error fetching tasks:', error.message);
    else setTasks(data || []);
  };

  const handleToggleCompleted = async (taskId: string, newValue: boolean) => {
    const { error } = await supabase.from('tasks').update({ completed: newValue }).eq('id', taskId);
    if (error) console.error('Error updating task completion:', error.message);
    else await fetchTasks();
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

        {/* Task List */}
        <TaskList 
          tasks={filteredTasks}
          onToggleCompleted={handleToggleCompleted}
          onEditTask={openEditModal}
        />
      </div>
    </ClinicianLayout>
  );
};

export default TasksPage;
