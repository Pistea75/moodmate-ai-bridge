
'use client';

import { useState } from 'react';
import ClinicianLayout from '@/layouts/ClinicianLayout';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TaskForm } from '@/components/clinician/TaskForm';
import { TaskList } from '@/components/clinician/TaskList';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';

const TasksPage = () => {
  const { tasks, loading, error, search, setSearch, fetchTasks, toggleTaskCompletion, deleteTask } = useTasks();
  const [formData, setFormData] = useState({
    id: null as string | null,
    title: '',
    description: '',
    due_date: '',
    patient_id: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

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

        {/* Task list */}
        <TaskList 
          tasks={tasks}
          onToggleCompleted={toggleTaskCompletion}
          onEditTask={openEditModal}
          onDeleteTask={deleteTask}
          loading={loading}
        />
      </div>
    </ClinicianLayout>
  );
};

export default TasksPage;
