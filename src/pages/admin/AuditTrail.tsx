
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Shield, Users, Database, 
  Search, RefreshCw, Clock, User, Activity
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface AuditLog {
  id: string;
  action: string;
  admin_id: string;
  target_user_id: string;
  metadata: any;
  created_at: string;
  admin_name?: string;
  target_user_name?: string;
}

export default function AuditTrail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchAuditLogs();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('admin_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      // Format the data with mock names since we can't join with profiles
      const formattedLogs: AuditLog[] = (data || []).map(log => ({
        ...log,
        admin_name: `Admin ${log.admin_id.substring(0, 8)}`,
        target_user_name: log.target_user_id ? `User ${log.target_user_id.substring(0, 8)}` : 'System'
      }));

      setLogs(formattedLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.admin_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  };

  const getActionColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create_user': return 'text-green-600 bg-green-50 border-green-200';
      case 'update_user': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delete_user': return 'text-red-600 bg-red-50 border-red-200';
      case 'access_phi': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'system_backup': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create_user': return <Users className="h-4 w-4" />;
      case 'update_user': return <User className="h-4 w-4" />;
      case 'delete_user': return <Users className="h-4 w-4" />;
      case 'access_phi': return <Shield className="h-4 w-4" />;
      case 'system_backup': return <Database className="h-4 w-4" />;
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
              <FileText className="h-8 w-8 text-blue-600" />
              Audit Trail
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track all administrative actions and changes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchAuditLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Actions</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Administrative actions</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">User Operations</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.action.includes('user')).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">User-related actions</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">PHI Access</CardTitle>
              <Shield className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {logs.filter(log => log.action.includes('phi')).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">PHI access events</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">System Actions</CardTitle>
              <Database className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">
                {logs.filter(log => log.action.includes('system')).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">System operations</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search actions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="create_user">Create User</SelectItem>
                  <SelectItem value="update_user">Update User</SelectItem>
                  <SelectItem value="delete_user">Delete User</SelectItem>
                  <SelectItem value="access_phi">Access PHI</SelectItem>
                  <SelectItem value="system_backup">System Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail Table */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Audit Trail ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Admin User</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Target User</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Details</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={`${getActionColor(log.action)} font-medium`}>
                          <div className="flex items-center gap-1">
                            {getActionIcon(log.action)}
                            {log.action.toUpperCase()}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {log.admin_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {log.target_user_name}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate text-gray-600 dark:text-gray-400">
                          {log.metadata ? JSON.stringify(log.metadata) : 'No details'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                          <Clock className="h-3 w-3 text-gray-400" />
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
