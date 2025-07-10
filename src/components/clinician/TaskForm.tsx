
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  patient_id?: string;
  clinician_id: string;
}

interface Patient {
  id: string;
  first_name: string;
  last_name: string;
}

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
  task?: Task | null;
}

const taskCategories = [
  'Assessment',
  'CBT',
  'Coping Skills',
  'Education',
  'Goal Setting',
  'Homework',
  'Mindfulness',
  'Social Skills',
  'Treatment Planning',
  'Other'
];

export function TaskForm({ open, onClose, onTaskCreated, task }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: '',
    patient_id: ''
  });
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [dueDate, setDueDate] = useState<Date>();
  const { toast } = useToast();

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date || '',
        priority: task.priority,
        category: task.category || '',
        patient_id: task.patient_id || ''
      });
      if (task.due_date) {
        setDueDate(new Date(task.due_date));
      }
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        category: '',
        patient_id: ''
      });
      setDueDate(undefined);
    }
  }, [task]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      // First get the patient IDs linked to this clinician
      const { data: links, error: linksError } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', currentUser.user.id);

      if (linksError) throw linksError;

      if (!links || links.length === 0) {
        setPatients([]);
        return;
      }

      // Then get the patient profiles
      const patientIds = links.map(link => link.patient_id).filter(Boolean);
      
      const { data: patientsData, error: patientsError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', patientIds)
        .eq('role', 'patient');

      if (patientsError) throw patientsError;

      setPatients(patientsData || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a task title',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) throw new Error('Not authenticated');

      const taskData = {
        ...formData,
        due_date: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        clinician_id: currentUser.user.id,
        patient_id: formData.patient_id || null
      };

      if (task) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update(taskData)
          .eq('id', task.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task updated successfully'
        });
      } else {
        // Create new task
        const { error } = await supabase
          .from('tasks')
          .insert([taskData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Task created successfully'
        });
      }

      onTaskCreated();
      onClose();
    } catch (error: any) {
      console.error('Error saving task:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save task',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create New Task'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter task description or instructions"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: 'low' | 'medium' | 'high' | 'urgent') =>
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {taskCategories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="patient">Assign to Patient (Optional)</Label>
            <Select
              value={formData.patient_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, patient_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No patient (General task)</SelectItem>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Due Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, 'PPP') : 'Select due date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
