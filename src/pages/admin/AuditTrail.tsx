
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, Search, Filter, Download, User, Database, Shield, 
  Clock, RefreshCw, Activity, AlertTriangle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  target_user_id?: string;
  metadata: any;
  created_at: string;
  user_name?: string;
  target_user_name?: string;
}

export default function AuditTrail() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

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
  }, [auditLogs, searchTerm, actionFilter, dateFilter]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      
      const { data: adminLogsData, error: adminError } = await supabase
        .from('admin_logs')
        .select(`
          *,
          admin:admin_id (first_name, last_name),
          target_user:target_user_id (first_name, last_name)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (adminError) throw adminError;

      // Also fetch from sensitive operations log
      const { data: sensitiveLogsData, error: sensitiveError } = await supabase
        .from('sensitive_operations_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (sensitiveError) throw sensitiveError;

      // Combine and format the logs
      const formattedAdminLogs = (adminLogsData || []).map(log => ({
        id: log.id,
        admin_id: log.admin_id,
        action: log.action,
        target_user_id: log.target_user_id,
        metadata: log.metadata,
        created_at: log.created_at,
        user_name: log.admin ? `${log.admin.first_name} ${log.admin.last_name}` : 'Unknown',
        target_user_name: log.target_user ? `${log.target_user.first_name} ${log.target_user.last_name}` : null
      }));

      const formattedSensitiveLogs = (sensitiveLogsData || []).map(log => ({
        id: log.id,
        admin_id: log.user_id,
        action: `${log.operation}_${log.table_name}`,
        target_user_id: log.record_id,
        metadata: { old_values: log.old_values, new_values: log.new_values },
        created_at: log.created_at,
        user_name: 'System User',
        target_user_name: null
      }));

      const allLogs = [...formattedAdminLogs, ...formattedSensitiveLogs]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setAuditLogs(allLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = auditLogs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.target_user_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action.includes(actionFilter));
    }

    if (dateFilter !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(log => new Date(log.created_at) >= cutoffDate);
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action: string) => {
    if (action.includes('user')) return <User className="h-4 w-4" />;
    if (action.includes('admin')) return <Shield className="h-4 w-4" />;
    if (action.includes('data') || action.includes('update') || action.includes('delete')) return <Database className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getActionColor = (action: string) => {
    if (action.includes('delete')) return 'text-red-600';
    if (action.includes('create') || action.includes('add')) return 'text-green-600';
    if (action.includes('update') || action.includes('edit')) return 'text-blue-600';
    return 'text-gray-600';
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Timestamp', 'User', 'Action', 'Target User', 'Details'],
      ...filteredLogs.map(log => [
        new Date(log.created_at).toLocaleString(),
        log.user_name || 'Unknown',
        log.action,
        log.target_user_name || 'N/A',
        JSON.stringify(log.metadata)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive log of all administrative actions</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportAuditLog}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" onClick={fetchAuditLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Badge variant="outline" className="px-3 py-1 border-blue-200 text-blue-800 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-700">
              SUPER ADMIN
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Actions</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{auditLogs.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">User Actions</CardTitle>
              <User className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {auditLogs.filter(log => log.action.includes('user')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Changes</CardTitle>
              <Database className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {auditLogs.filter(log => 
                  log.action.includes('update') || 
                  log.action.includes('delete') || 
                  log.action.includes('INSERT')
                ).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Critical Actions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {auditLogs.filter(log => 
                  log.action.includes('delete') || 
                  log.action.includes('admin') ||
                  log.action.includes('super_admin')
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search audit logs..."
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
                  <SelectItem value="user">User Actions</SelectItem>
                  <SelectItem value="admin">Admin Actions</SelectItem>
                  <SelectItem value="delete">Delete Actions</SelectItem>
                  <SelectItem value="update">Update Actions</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Audit Trail Table */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Audit Events ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">User</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Target</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Details</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={getActionColor(log.action)}>
                            {getActionIcon(log.action)}
                          </div>
                          <span className={`font-medium ${getActionColor(log.action)}`}>
                            {log.action.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {log.user_name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {log.admin_id}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        {log.target_user_name || log.target_user_id || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {log.metadata ? JSON.stringify(log.metadata).substring(0, 50) + '...' : 'No details'}
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
