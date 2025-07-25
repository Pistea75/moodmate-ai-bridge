
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Shield, Search, Filter, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details: any;
  success: boolean;
  ip_address: string;
  user_agent: string;
  created_at: string;
}

export function SecurityAuditPanel() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [successFilter, setSuccessFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLogs = async (reset = false) => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .range(reset ? 0 : page * 50, (reset ? 0 : page * 50) + 49);

      if (actionFilter !== 'all') {
        query = query.eq('action', actionFilter);
      }

      if (successFilter !== 'all') {
        query = query.eq('success', successFilter === 'true');
      }

      if (searchTerm) {
        query = query.or(`action.ilike.%${searchTerm}%,resource.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch security audit logs",
          variant: "destructive",
        });
        return;
      }

      if (reset) {
        setLogs(data || []);
        setPage(0);
      } else {
        setLogs(prev => [...prev, ...(data || [])]);
      }

      setHasMore((data || []).length === 50);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(true);
  }, [searchTerm, actionFilter, successFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs(true);
  };

  const exportLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('security_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) throw error;

      const csvContent = [
        ['Timestamp', 'Action', 'Resource', 'User ID', 'Success', 'IP Address', 'Details'],
        ...data.map(log => [
          log.created_at,
          log.action,
          log.resource,
          log.user_id || 'N/A',
          log.success ? 'Success' : 'Failed',
          log.ip_address || 'N/A',
          JSON.stringify(log.details || {})
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-audit-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Audit logs exported successfully",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Error",
        description: "Failed to export audit logs",
        variant: "destructive",
      });
    }
  };

  const getActionBadgeColor = (action: string, success: boolean) => {
    if (!success) return 'bg-red-100 text-red-800';
    
    switch (action) {
      case 'signin_success':
      case 'signup_success':
        return 'bg-green-100 text-green-800';
      case 'auth_failure':
      case 'unauthorized_access':
        return 'bg-red-100 text-red-800';
      case 'role_validated':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatDetails = (details: any) => {
    if (!details || typeof details !== 'object') return '';
    
    const relevantKeys = ['error', 'user_id', 'email', 'role', 'ip_address'];
    const formatted = relevantKeys
      .filter(key => details[key])
      .map(key => `${key}: ${details[key]}`)
      .join(', ');
    
    return formatted.length > 100 ? formatted.substring(0, 100) + '...' : formatted;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <CardTitle>Security Audit Logs</CardTitle>
          </div>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search actions or resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button type="submit" variant="outline" size="sm">
              Search
            </Button>
          </form>
          
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="signin_success">Sign In Success</SelectItem>
              <SelectItem value="signin_failed">Sign In Failed</SelectItem>
              <SelectItem value="signup_success">Sign Up Success</SelectItem>
              <SelectItem value="auth_failure">Auth Failure</SelectItem>
              <SelectItem value="unauthorized_access">Unauthorized Access</SelectItem>
              <SelectItem value="role_validated">Role Validated</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={successFilter} onValueChange={setSuccessFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Success" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Success</SelectItem>
              <SelectItem value="false">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-4 py-2 text-left">Timestamp</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Action</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Resource</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-200 px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {formatTimestamp(log.created_at)}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <Badge className={getActionBadgeColor(log.action, log.success)}>
                      {log.action}
                    </Badge>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm">
                    {log.resource}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          Success
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="h-3 w-3" />
                          Failed
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                    {formatDetails(log.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-4 text-center">
            <Button
              onClick={() => {
                setPage(prev => prev + 1);
                fetchLogs(false);
              }}
              variant="outline"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}

        {logs.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            No audit logs found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
