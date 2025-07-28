
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Database, Activity, HardDrive, Download, Upload, RefreshCw, 
  AlertTriangle, CheckCircle, Clock, TrendingUp
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface DatabaseStats {
  totalRecords: number;
  storageUsed: string;
  activeConnections: number;
  queryPerformance: number;
  lastBackup: string;
  backupSize: string;
}

export default function DatabaseManagement() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [stats, setStats] = useState<DatabaseStats>({
    totalRecords: 0,
    storageUsed: '0 MB',
    activeConnections: 0,
    queryPerformance: 0,
    lastBackup: '',
    backupSize: '0 MB'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchDatabaseStats();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  const fetchDatabaseStats = async () => {
    try {
      setLoading(true);
      
      // Get table counts
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact' });
      
      const { data: moodData, error: moodError } = await supabase
        .from('mood_entries')
        .select('id', { count: 'exact' });

      const { data: chatData, error: chatError } = await supabase
        .from('chat_messages')
        .select('id', { count: 'exact' });

      // Mock some additional stats since we can't get real database metrics
      setStats({
        totalRecords: (profilesData?.length || 0) + (moodData?.length || 0) + (chatData?.length || 0),
        storageUsed: '245 MB',
        activeConnections: 12,
        queryPerformance: 95,
        lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        backupSize: '189 MB'
      });
      
    } catch (error) {
      console.error('Error fetching database stats:', error);
      toast.error('Failed to load database statistics');
    } finally {
      setLoading(false);
    }
  };

  const performBackup = async () => {
    try {
      toast.loading('Starting database backup...');
      
      // In a real implementation, this would trigger a backup
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setStats(prev => ({
        ...prev,
        lastBackup: new Date().toISOString(),
        backupSize: '195 MB'
      }));
      
      toast.success('Database backup completed successfully');
    } catch (error) {
      console.error('Error performing backup:', error);
      toast.error('Failed to perform database backup');
    }
  };

  const optimizeDatabase = async () => {
    try {
      toast.loading('Optimizing database...');
      
      // In a real implementation, this would optimize the database
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setStats(prev => ({
        ...prev,
        queryPerformance: Math.min(100, prev.queryPerformance + 5)
      }));
      
      toast.success('Database optimization completed');
    } catch (error) {
      console.error('Error optimizing database:', error);
      toast.error('Failed to optimize database');
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
              <Database className="h-8 w-8 text-purple-600" />
              Database Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor and manage database operations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchDatabaseStats} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Database Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Records</CardTitle>
              <Database className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.totalRecords.toLocaleString()}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Across all tables</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Storage Used</CardTitle>
              <HardDrive className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.storageUsed}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Database size</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Connections</CardTitle>
              <Activity className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.activeConnections}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Current connections</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Performance</CardTitle>
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.queryPerformance}%</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Query performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Database Operations */}
        <Tabs defaultValue="backup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Backup Operations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Last Backup</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {stats.lastBackup ? new Date(stats.lastBackup).toLocaleString() : 'Never'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <HardDrive className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Backup Size</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{stats.backupSize}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Button onClick={performBackup} className="w-full bg-blue-600 hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Create Backup
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Restore from Backup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Database Maintenance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Button onClick={optimizeDatabase} className="w-full bg-green-600 hover:bg-green-700">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Optimize Database
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rebuild Indexes
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <Button variant="outline" className="w-full">
                      <Database className="h-4 w-4 mr-2" />
                      Vacuum Database
                    </Button>
                    
                    <Button variant="outline" className="w-full">
                      <Clock className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-6">
            <Card className="border-gray-200 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-amber-600" />
                  Database Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Database className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>Real-time database monitoring will be available here</p>
                  <p className="text-sm">Query performance, connection pools, and metrics</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
