import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityMonitoringDashboard } from './SecurityMonitoringDashboard';
import { useSuperAdmin } from '@/hooks/useSuperAdmin';
import { Shield, Users, Lock, Database, AlertTriangle } from 'lucide-react';

/**
 * Comprehensive security panel for super administrators
 * Combines monitoring, user management, and security controls
 */
export function AdminSecurityPanel() {
  const { isSuperAdmin, loading } = useSuperAdmin();

  if (loading) {
    return <div className="p-6">Loading security panel...</div>;
  }

  if (!isSuperAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
              <p className="text-muted-foreground">
                Super administrator privileges required to access this panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Security Administration Panel</h1>
        <Badge variant="destructive">Super Admin</Badge>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Policies</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Review Policies
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Security</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="sm" className="w-full">
              Run Audit
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Actions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <Button variant="destructive" size="sm" className="w-full">
              Emergency Lock
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Security Monitoring Dashboard */}
      <SecurityMonitoringDashboard />

      {/* Security Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Security Guidelines & Procedures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Administrative Access Procedures</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• All administrative access is logged and audited</li>
                <li>• Use super admin privileges only when necessary</li>
                <li>• Patient data access requires clinical justification</li>
                <li>• Emergency procedures documented in security handbook</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Data Protection Compliance</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• HIPAA compliance monitoring active</li>
                <li>• PHI access automatically logged</li>
                <li>• Data retention policies enforced</li>
                <li>• Regular security audits scheduled</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Security Incident Response</h4>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Automated threat detection enabled</li>
                <li>• Real-time alerts for high-risk events</li>
                <li>• Incident escalation procedures defined</li>
                <li>• Recovery protocols documented</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}