
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Server, Activity, Database, Wifi, HardDrive, Cpu, MemoryStick, 
  AlertTriangle, CheckCircle, RefreshCw, Clock, TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  activeConnections: number;
  responseTime: number;
  uptime: number;
  errors: number;
}

export default function SystemHealth() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: 0,
    memory: 0,
    disk: 0,
    network: 0,
    activeConnections: 0,
    responseTime: 0,
    uptime: 0,
    errors: 0
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchSystemMetrics();
      const interval = setInterval(fetchSystemMetrics, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  const fetchSystemMetrics = async () => {
    try {
      setLoading(true);
      
      // Simulate system metrics (in production, these would come from monitoring services)
      const mockMetrics: SystemMetrics = {
        cpu: Math.floor(Math.random() * 40) + 10, // 10-50%
        memory: Math.floor(Math.random() * 30) + 50, // 50-80%
        disk: Math.floor(Math.random() * 20) + 30, // 30-50%
        network: Math.floor(Math.random() * 15) + 5, // 5-20%
        activeConnections: Math.floor(Math.random() * 20) + 10, // 10-30
        responseTime: Math.floor(Math.random() * 50) + 20, // 20-70ms
        uptime: 99.9,
        errors: Math.floor(Math.random() * 5) // 0-5 errors
      };
      
      setMetrics(mockMetrics);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching system metrics:', error);
      toast.error('Failed to load system metrics');
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatus = () => {
    const { cpu, memory, disk, errors } = metrics;
    if (errors > 3 || cpu > 80 || memory > 90 || disk > 80) return 'critical';
    if (errors > 1 || cpu > 60 || memory > 75 || disk > 70) return 'warning';
    return 'healthy';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Server className="h-5 w-5 text-gray-600" />;
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

  const healthStatus = getHealthStatus();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Server className="h-8 w-8 text-blue-600" />
              System Health
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time system monitoring and diagnostics</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchSystemMetrics} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Overall Health Status */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
              {getStatusIcon(healthStatus)}
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${getStatusColor(healthStatus)}`}>
                  {healthStatus === 'healthy' ? 'All Systems Operational' : 
                   healthStatus === 'warning' ? 'Performance Warning' : 'Critical Issues Detected'}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                <div className="text-2xl font-bold text-green-600">{metrics.uptime}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Tabs defaultValue="resources" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="errors">Errors & Logs</TabsTrigger>
          </TabsList>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">CPU Usage</CardTitle>
                  <Cpu className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{metrics.cpu}%</div>
                  <Progress value={metrics.cpu} className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {metrics.cpu < 50 ? 'Normal' : metrics.cpu < 80 ? 'High' : 'Critical'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Memory Usage</CardTitle>
                  <MemoryStick className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{metrics.memory}%</div>
                  <Progress value={metrics.memory} className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {metrics.memory < 70 ? 'Normal' : metrics.memory < 85 ? 'High' : 'Critical'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Disk Usage</CardTitle>
                  <HardDrive className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{metrics.disk}%</div>
                  <Progress value={metrics.disk} className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {metrics.disk < 60 ? 'Normal' : metrics.disk < 80 ? 'High' : 'Critical'}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Network Usage</CardTitle>
                  <Wifi className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{metrics.network}%</div>
                  <Progress value={metrics.network} className="w-full" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {metrics.network < 30 ? 'Normal' : metrics.network < 60 ? 'High' : 'Critical'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Response Time</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.responseTime}ms</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Average response time</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Connections</CardTitle>
                  <Activity className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeConnections}</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Current connections</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 dark:border-gray-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">System Uptime</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.uptime}%</div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Errors Tab */}
          <TabsContent value="errors" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  Error Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-red-600">{metrics.errors}</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Errors in last 24 hours</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Critical errors</p>
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
