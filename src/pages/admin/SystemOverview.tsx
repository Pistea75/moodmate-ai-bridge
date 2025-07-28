
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Users, 
  Database, 
  Activity, 
  AlertTriangle, 
  Server,
  Eye,
  Lock,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3
} from 'lucide-react';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export default function SystemOverview() {
  const { user } = useAuth();
  const { isSuperAdmin, loading } = useSecureRoleValidation(user);
  const navigate = useNavigate();
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    clinicians: 0,
    patients: 0,
    sessions: 0,
    moodEntries: 0,
    systemHealth: 'healthy'
  });

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      navigate('/clinician/dashboard');
    }
  }, [loading, isSuperAdmin, navigate]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchSystemStats();
    }
  }, [isSuperAdmin]);

  const fetchSystemStats = async () => {
    try {
      // Fetch real data from the database
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('role, status');

      const { data: sessions, error: sessionsError } = await supabase
        .from('sessions')
        .select('id');

      const { data: moodEntries, error: moodError } = await supabase
        .from('mood_entries')
        .select('id');

      if (usersError || sessionsError || moodError) {
        console.error('Error fetching stats:', { usersError, sessionsError, moodError });
      }

      const totalUsers = users?.length || 0;
      const activeUsers = users?.filter(u => u.status === 'active').length || 0;
      const clinicians = users?.filter(u => u.role === 'clinician').length || 0;
      const patients = users?.filter(u => u.role === 'patient').length || 0;

      setSystemStats({
        totalUsers,
        activeUsers,
        clinicians,
        patients,
        sessions: sessions?.length || 0,
        moodEntries: moodEntries?.length || 0,
        systemHealth: 'healthy'
      });
    } catch (error) {
      console.error('Error fetching system stats:', error);
    }
  };

  if (loading) {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-blue-600" />
              System Overview
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive system administration dashboard</p>
          </div>
          <Badge variant="outline" className="px-4 py-2 text-sm border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
            SUPER ADMIN
          </Badge>
        </div>

        {/* System Health Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.totalUsers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Registered users</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.activeUsers}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Currently active</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Sessions</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{systemStats.sessions}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total sessions</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Mood Entries</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{systemStats.moodEntries}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total entries</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/user-management')}>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Manage user accounts, roles, and permissions across the platform.
              </p>
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                Manage Users
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/super-admin-panel')}>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber-600" />
                PHI Access Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Request and manage access to protected health information with audit trails.
              </p>
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                Access PHI Panel
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate('/admin/system-health')}>
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                System Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Monitor system performance, logs, and health metrics in real-time.
              </p>
              <Button variant="outline" className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                View Metrics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Statistics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-600" />
                System Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">CPU Usage</span>
                  <Badge variant="outline" className="text-green-600 border-green-600 dark:border-green-500">23%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Memory Usage</span>
                  <Badge variant="outline" className="text-blue-600 border-blue-600 dark:border-blue-500">67%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Storage</span>
                  <Badge variant="outline" className="text-amber-600 border-amber-600 dark:border-amber-500">45%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Network</span>
                  <Badge variant="outline" className="text-green-600 border-green-600 dark:border-green-500">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-amber-600" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">System backup completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Database optimization finished</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Security scan completed</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
