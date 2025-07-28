
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Eye, Shield, AlertTriangle, CheckCircle, XCircle, 
  Search, RefreshCw, Clock, User, Globe
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';

interface SecurityLog {
  id: string;
  action: string;
  resource: string;
  success: boolean;
  user_id: string;
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
  const [statusFilter, setStatusFilter] = useState('all');

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
  }, [logs, searchTerm, statusFilter]);

  const fetchSecurityLogs = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const formattedLogs: SecurityLog[] = (data || []).map(log => ({
        id: log.id,
        action: log.action,
        resource: log.resource,
        success: log.success,
        user_id: log.user_id || 'System',
        ip_address: log.ip_address?.toString() || 'N/A',
        user_agent: log.user_agent || 'N/A',
        details: log.details,
        created_at: log.created_at
      }));

      setLogs(formattedLogs);
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
        log.user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ip_address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(log => 
        statusFilter === 'success' ? log.success : !log.success
      );
    }

    setFilteredLogs(filtered);
  };

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'text-green-600 bg-green-50 border-green-200'
      : 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (success: boolean) => {
    return success 
      ? <CheckCircle className="h-4 w-4" />
      : <XCircle className="h-4 w-4" />;
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
            <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor security events and access attempts</p>
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

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Events</CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{logs.length}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Security events logged</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.success).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Successful operations</p>
            </CardContent>
          </Card>
          
          <Card className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Failed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {logs.filter(log => !log.success).length}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Failed attempts</p>
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
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="success">Successful Only</SelectItem>
                  <SelectItem value="failed">Failed Only</SelectItem>
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
                    <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Action</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Resource</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">User</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">IP Address</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge className={`${getStatusColor(log.success)} font-medium`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(log.success)}
                            {log.success ? 'SUCCESS' : 'FAILED'}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {log.action}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 dark:text-gray-400">
                          {log.resource}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900 dark:text-white">
                            {log.user_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {log.ip_address}
                          </span>
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
