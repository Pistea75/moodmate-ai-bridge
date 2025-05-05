
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ClinicianLayout from '@/layouts/ClinicianLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Pencil, PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { PatientSelector } from '@/components/session/PatientSelector';

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
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
    fetchPatients();
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

  const fetchPatients = async () => {
    const { data: user } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from('patient_clinician_links')
      .select('patient_id, profiles:patient_id(first_name, last_name)')
      .eq('clinician_id', user.user?.id);

    if (error) console.error('Error fetching patients:', error.message);
    else setPatients(data || []);
  };

  const handleCreateOrUpdateTask = async () => {
    const { data: user } = await supabase.auth.getUser();

    if (isEdit && formData.id) {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: formData.title,
          description: formData.description,
          due_date: formData.due_date,
          patient_id: formData.patient_id,
        })
        .eq('id', formData.id)
        .eq('clinician_id', user.user?.id);

      if (error) return console.error('Update failed:', error.message);
    } else {
      const { error } = await supabase.from('tasks').insert({
        title: formData.title,
        description: formData.description,
        due_date: formData.due_date,
        completed: false,
        patient_id: formData.patient_id,
        clinician_id: user.user?.id,
      });

      if (error) return console.error('Create failed:', error.message);
    }

    setFormData({ id: null, title: '', description: '', due_date: '', patient_id: '' });
    setIsEdit(false);
    setShowDialog(false);
    await fetchTasks();
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
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold">
                    {isEdit ? 'Edit Task' : 'Create New Task'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                  {/* Patient Selection - First */}
                  <div className="space-y-2">
                    <PatientSelector 
                      value={formData.patient_id} 
                      onChange={(value) => setFormData({ ...formData, patient_id: value })}
                    />
                  </div>
                  
                  {/* Title - Second */}
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Task title"
                    />
                  </div>
                  
                  {/* Description - Third */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Task description"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  {/* Due Date - Fourth */}
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Due Date</Label>
                    <Input
                      id="due_date"
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                  
                  <Button 
                    className="w-full mt-6" 
                    onClick={handleCreateOrUpdateTask}
                    disabled={!formData.title || !formData.patient_id || !formData.due_date}
                  >
                    {isEdit ? 'Update Task' : 'Create Task'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Task List */}
        <div className="grid gap-4">
          {filteredTasks.length === 0 && (
            <p className="text-muted-foreground">No tasks found.</p>
          )}
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(val) => handleToggleCompleted(task.id, Boolean(val))}
                  className="mt-1"
                />
                <div className="flex-1">
                  <h3
                    className={`font-medium ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due: {format(new Date(task.due_date), 'yyyy-MM-dd')}
                    </span>
                    <span>•</span>
                    <span>
                      Patient: {task.profiles?.first_name} {task.profiles?.last_name}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => openEditModal(task)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
};

export default TasksPage;
