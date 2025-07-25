import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, CheckCircle, XCircle, Download } from 'lucide-react';
import { format } from 'date-fns';

interface AuditLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  success: boolean;
  ip_address: string;
  user_agent: string;
  created_at: string;
  details: any;
}

export function SecurityAuditPanel() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed'>('all');

  useEffect(() => {
    fetchAuditLogs();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('audit_logs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, (payload) => {
        const newLog = payload.new as any;
        setAuditLogs(prev => [transformAuditLog(newLog), ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const transformAuditLog = (log: any): AuditLog => ({
    id: log.id,
    user_id: log.user_id,
    action: log.action,
    resource: log.resource,
    success: log.success,
    ip_address: log.ip_address?.toString() || 'unknown',
    user_agent: log.user_agent,
    created_at: log.created_at,
    details: log.details
  });

  const fetchAuditLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      
      setAuditLogs(data?.map(transformAuditLog) || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    if (filter === 'success') return log.success;
    if (filter === 'failed') return !log.success;
    return true;
  });

  const exportLogs = () => {
    const csvContent = [
      ['Date', 'User ID', 'Action', 'Resource', 'Success', 'IP Address', 'User Agent'].join(','),
      ...filteredLogs.map(log => [
        format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
        log.user_id,
        log.action,
        log.resource,
        log.success ? 'Yes' : 'No',
        log.ip_address,
        log.user_agent
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionIcon = (action: string, success: boolean) => {
    if (!success) return <XCircle className="h-4 w-4 text-red-500" />;
    
    switch (action) {
      case 'login':
      case 'logout':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'password_change':
      case 'profile_update':
        return <Shield className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  if (loading) {
    return <div className="p-6">Loading audit logs...</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Audit Panel
          </CardTitle>
          <Button onClick={exportLogs} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(value) => setFilter(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="success">Successful</TabsTrigger>
            <TabsTrigger value="failed">Failed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={filter} className="mt-4">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getActionIcon(log.action, log.success)}
                    <div>
                      <div className="font-medium">{log.action}</div>
                      <div className="text-sm text-muted-foreground">
                        {log.resource} • {format(new Date(log.created_at), 'MMM d, yyyy HH:mm')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={log.success ? 'default' : 'destructive'}>
                      {log.success ? 'Success' : 'Failed'}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {log.ip_address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
