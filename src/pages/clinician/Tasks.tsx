
import { useEffect, useState, useCallback } from 'react';
import { Plus, Filter, Calendar, Users, CheckSquare, AlertCircle, Clock, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { useToast } from '@/hooks/use-toast';
import { TaskForm } from '@/components/clinician/TaskForm';
import { TaskTemplateSelector } from '@/components/clinician/TaskTemplateSelector';

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
  inserted_at: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
}

interface TaskStats {
  total: number;
  completed: number;
  overdue: number;
  dueToday: number;
  high_priority: number;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    overdue: 0,
    dueToday: 0,
    high_priority: 0
  });
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    category: 'all',
    patient: 'all'
  });
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          patient:profiles!tasks_patient_id_fkey(first_name, last_name)
        `)
        .eq('clinician_id', currentUser.user.id)
        .order('inserted_at', { ascending: false });

      if (error) throw error;

      const tasksData = (data || []) as Task[];
      setTasks(tasksData);

      // Calculate statistics
      const today = new Date().toISOString().split('T')[0];
      const stats = tasksData.reduce((acc, task) => {
        acc.total++;
        if (task.completed) acc.completed++;
        if (task.due_date && task.due_date < today && !task.completed) acc.overdue++;
        if (task.due_date === today && !task.completed) acc.dueToday++;
        if ((task.priority === 'high' || task.priority === 'urgent') && !task.completed) acc.high_priority++;
        return acc;
      }, { total: 0, completed: 0, overdue: 0, dueToday: 0, high_priority: 0 });

      setStats(stats);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tasks',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskComplete = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: completed ? 'Task Completed' : 'Task Reopened',
        description: completed ? 'Great job on completing the task!' : 'Task has been reopened'
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: 'Error',
        description: 'Failed to update task',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      toast({
        title: 'Task Deleted',
        description: 'Task has been successfully deleted'
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        variant: 'destructive'
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.status !== 'all') {
      if (filters.status === 'completed' && !task.completed) return false;
      if (filters.status === 'pending' && task.completed) return false;
      if (filters.status === 'overdue') {
        const today = new Date().toISOString().split('T')[0];
        if (!task.due_date || task.due_date >= today || task.completed) return false;
      }
    }
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    if (filters.category !== 'all' && task.category !== filters.category) return false;
    return true;
  });

  const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              Tasks & Activities
            </h1>
            <p className="text-gray-600 mt-1">
              Manage patient tasks, therapeutic activities, and treatment plans
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowTemplateModal(true)}
            >
              Templates
            </Button>
            <Button
              onClick={() => setShowTaskForm(true)}
              className="bg-mood-purple hover:bg-mood-purple/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-gray-500">
                {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Due Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.dueToday}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overdue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">High Priority</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.high_priority}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tasks..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.category} onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setFilters({ search: '', status: 'all', priority: 'all', category: 'all', patient: 'all' })}
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
                <p className="text-gray-600 mb-4">
                  {tasks.length === 0 
                    ? 'Create your first task to get started with patient care management.'
                    : 'No tasks match your current filters. Try adjusting your search criteria.'
                  }
                </p>
                <Button onClick={() => setShowTaskForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className={`transition-all hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => handleTaskComplete(task.id, e.target.checked)}
                          className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {task.title}
                        </h3>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        {task.category && (
                          <Badge variant="outline">{task.category}</Badge>
                        )}
                      </div>
                      
                      {task.description && (
                        <p className="text-gray-600 text-sm mb-2 ml-7">{task.description}</p>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 ml-7">
                        {task.patient && (
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {task.patient.first_name} {task.patient.last_name}
                          </div>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Created: {new Date(task.inserted_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTask(task);
                          setShowTaskForm(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <TaskForm
            open={showTaskForm}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            task={editingTask}
            onTaskCreated={() => {
              fetchTasks();
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}

        {/* Task Templates Modal */}
        {showTemplateModal && (
          <TaskTemplateSelector
            open={showTemplateModal}
            onClose={() => setShowTemplateModal(false)}
            onSelectTemplate={(template) => {
              setShowTaskForm(true);
              setShowTemplateModal(false);
            }}
          />
        )}
      </div>
    </ClinicianLayout>
  );
}
