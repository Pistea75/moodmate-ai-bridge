
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, Search, Filter, AlertTriangle, Shield, Clock, User, RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface SecurityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  success: boolean;
  ip_address: string;
  user_agent: string;
  details: any;
  created_at: string;
}

export default function SecurityLogs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isSuperAdmin, loading: superAdminLoading } = useSuperAdmin();
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [successFilter, setSuccessFilter] = useState('all');

  useEffect(() => {
    if (!superAdminLoading && !isSuperAdmin) {
      toast.error('Access denied. Super admin privileges required.');
      navigate('/');
      return;
    }
    
    if (isSuperAdmin) {
      fetchSecurityLogs();
    }
  }, [user, isSuperAdmin, superAdminLoading, navigate]);

  useEffect(() => {
    filterLogs();
  }, [logs, searchTerm, actionFilter, successFilter]);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      
      // Fetch from security_audit_logs table
      const { data: securityData, error: securityError } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (securityError) throw securityError;

      // Fetch from enhanced_security_logs table
      const { data: enhancedData, error: enhancedError } = await supabase
        .from('enhanced_security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (enhancedError) throw enhancedError;

      // Combine and format the logs
      const combinedLogs = [
        ...(securityData || []),
        ...(enhancedData || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setLogs(combinedLogs);
    } catch (error) {
      console.error('Error fetching security logs:', error);
      toast.error('Failed to load security logs');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = logs;

    if (searchTerm) {
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (successFilter !== 'all') {
      filtered = filtered.filter(log => log.success === (successFilter === 'success'));
    }

    setFilteredLogs(filtered);
  };

  const getSeverityColor = (success: boolean, action: string) => {
    if (!success) return 'bg-red-500';
    if (action.includes('login') || action.includes('auth')) return 'bg-blue-500';
    if (action.includes('delete') || action.includes('admin')) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getActionIcon = (action: string) => {
    if (action.includes('login') || action.includes('auth')) return <User className="h-4 w-4" />;
    if (action.includes('admin')) return <Shield className="h-4 w-4" />;
    if (action.includes('delete')) return <AlertTriangle className="h-4 w-4" />;
    return <Eye className="h-4 w-4" />;
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
              <Eye className="h-8 w-8 text-blue-600" />
              Security Logs
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor security events and access patterns</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={fetchSecurityLogs} disabled={loading}>
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
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Events</CardTitle>
              <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{logs.length}</div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Failed Events</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(log => !log.success).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Auth Events</CardTitle>
              <User className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {logs.filter(log => log.action.includes('auth') || log.action.includes('login')).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Actions</CardTitle>
              <Shield className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {logs.filter(log => log.action.includes('admin')).length}
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
                  placeholder="Search logs..."
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
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="admin_access">Admin Access</SelectItem>
                  <SelectItem value="data_access">Data Access</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={successFilter} onValueChange={setSuccessFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Results</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failure">Failure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Logs Table */}
        <Card className="border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Security Events ({filteredLogs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-300">Event</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">User</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Resource</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Result</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">IP Address</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.success, log.action)}`}></div>
                          {getActionIcon(log.action)}
                          <span className="font-medium text-gray-900 dark:text-white">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {log.user_id || 'Anonymous'}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{log.resource}</TableCell>
                      <TableCell>
                        <Badge variant={log.success ? 'default' : 'destructive'}>
                          {log.success ? 'Success' : 'Failed'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-900 dark:text-white">{log.ip_address || 'N/A'}</TableCell>
                      <TableCell className="text-gray-900 dark:text-white">
                        <div className="flex items-center gap-1">
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
