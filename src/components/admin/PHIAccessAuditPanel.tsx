
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Clock, User, AlertTriangle } from 'lucide-react';
import { useSuperAdmin, PHIAccessLog } from '@/hooks/useSuperAdmin';
import { format } from 'date-fns';

export function PHIAccessAuditPanel() {
  const { phiAccessLogs, fetchPHIAccessLogs } = useSuperAdmin();

  useEffect(() => {
    fetchPHIAccessLogs();
  }, []);

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case 'legal_compliance':
        return <Badge variant="destructive">Legal Compliance</Badge>;
      case 'user_request':
        return <Badge variant="secondary">User Request</Badge>;
      case 'escalated_support':
        return <Badge variant="default">Escalated Support</Badge>;
      case 'system_debug':
        return <Badge variant="outline">System Debug</Badge>;
      default:
        return <Badge variant="secondary">{reason}</Badge>;
    }
  };

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case 'production':
        return <Badge variant="destructive">Production</Badge>;
      case 'staging':
        return <Badge variant="secondary">Staging</Badge>;
      case 'development':
        return <Badge variant="outline">Development</Badge>;
      default:
        return <Badge variant="secondary">{env}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          PHI Access Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        {phiAccessLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No PHI access logs found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Data Type</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Environment</TableHead>
                  <TableHead>Justification</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phiAccessLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">
                      {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-mono text-sm">{log.admin_id.slice(0, 8)}...</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{log.patient_id.slice(0, 8)}...</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.accessed_table}</Badge>
                    </TableCell>
                    <TableCell>
                      {getReasonBadge(log.access_reason)}
                    </TableCell>
                    <TableCell>
                      {getEnvironmentBadge(log.environment)}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={log.justification}>
                        {log.justification}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
