
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, Activity, Database, Server, AlertTriangle, CheckCircle, 
  RefreshCw, Settings, Download, Upload, Trash2, Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface MaintenanceTask {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  lastRun?: Date;
  nextRun?: Date;
  duration?: number;
}

export default function SystemMaintenance() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [runningTasks, setRunningTasks] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchMaintenanceStatus();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  const fetchMaintenanceStatus = async () => {
    try {
      setLoading(true);
      
      // Mock maintenance tasks (in production, these would come from a system monitoring service)
      const mockTasks: MaintenanceTask[] = [
        {
          id: '1',
          name: 'Database Cleanup',
          description: 'Clean up old logs and temporary data',
          status: 'completed',
          lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
          duration: 1800
        },
        {
          id: '2',
          name: 'System Backup',
          description: 'Full system backup including database and files',
          status: 'completed',
          lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 22 * 60 * 60 * 1000),
          duration: 3600
        },
        {
          id: '3',
          name: 'Security Scan',
          description: 'Comprehensive security vulnerability scan',
          status: 'pending',
          nextRun: new Date(Date.now() + 6 * 60 * 60 * 1000),
          duration: 900
        },
        {
          id: '4',
          name: 'Performance Optimization',
          description: 'Optimize database queries and system performance',
          status: 'pending',
          nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          duration: 2700
        },
        {
          id: '5',
          name: 'Log Rotation',
          description: 'Rotate and compress system logs',
          status: 'completed',
          lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
          nextRun: new Date(Date.now() + 20 * 60 * 60 * 1000),
          duration: 300
        }
      ];

      setTasks(mockTasks);
      
      // Check if maintenance mode is enabled (this would be from system settings)
      setMaintenanceMode(false);
    } catch (error) {
      console.error('Error fetching maintenance status:', error);
      toast.error('Failed to load maintenance status');
    } finally {
      setLoading(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newMode = !maintenanceMode;
      setMaintenanceMode(newMode);
      
      // In production, this would update the system settings
      toast.success(`Maintenance mode ${newMode ? 'enabled' : 'disabled'}`);
      
      if (newMode) {
        toast.warning('Users will be unable to access the system during maintenance');
      }
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      toast.error('Failed to toggle maintenance mode');
    }
  };

  const runTask = async (taskId: string) => {
    try {
      setRunningTasks(prev => new Set(prev).add(taskId));
      
      // Simulate task execution
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'completed', lastRun: new Date() }
          : task
      ));
      
      toast.success('Maintenance task completed successfully');
    } catch (error) {
      console.error('Error running maintenance task:', error);
      toast.error('Failed to run maintenance task');
      
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'failed' }
          : task
      ));
    } finally {
      setRunningTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  if (superAdminLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Lock className="h-8 w-8 text-blue-600" />
              System Maintenance
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">System maintenance and operational controls</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchMaintenanceStatus} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Maintenance Mode Control */}
        <Card className={`border-gray-200 dark:border-gray-700 ${maintenanceMode ? 'bg-red-50 dark:bg-red-900/20' : ''}`}>
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              Maintenance Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  System Maintenance Mode
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {maintenanceMode 
                    ? 'System is currently in maintenance mode. Users cannot access the application.'
                    : 'System is operational and available to users.'
                  }
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={toggleMaintenanceMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Maintenance Tasks */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">Maintenance Tasks</TabsTrigger>
            <TabsTrigger value="backups">Backups</TabsTrigger>
            <TabsTrigger value="cleanup">Cleanup</TabsTrigger>
          </TabsList>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Scheduled Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <div key={task.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">{task.name}</h3>
                          <Badge className={`${getStatusColor(runningTasks.has(task.id) ? 'running' : task.status)} font-medium`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(runningTasks.has(task.id) ? 'running' : task.status)}
                              {runningTasks.has(task.id) ? 'Running' : task.status.toUpperCase()}
                            </div>
                          </Badge>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => runTask(task.id)}
                          disabled={runningTasks.has(task.id)}
                        >
                          {runningTasks.has(task.id) ? 'Running...' : 'Run Now'}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{task.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        {task.lastRun && (
                          <span>Last run: {task.lastRun.toLocaleString()}</span>
                        )}
                        {task.nextRun && (
                          <span>Next run: {task.nextRun.toLocaleString()}</span>
                        )}
                        {task.duration && (
                          <span>Duration: {Math.floor(task.duration / 60)}m {task.duration % 60}s</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backups Tab */}
          <TabsContent value="backups" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">Backup Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Database Backup</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Full database backup</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Create
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">System Configuration</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Settings and configuration backup</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Create
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cleanup Tab */}
          <TabsContent value="cleanup" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white">System Cleanup</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Clear System Logs</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Remove old system logs and temporary files</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Clean Now
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Optimize Database</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Clean up database and optimize performance</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Database className="h-4 w-4 mr-1" />
                      Optimize
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">Clear Cache</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Clear application cache and temporary data</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Clear Cache
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
