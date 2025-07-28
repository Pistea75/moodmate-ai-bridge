
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  Database, 
  Activity, 
  AlertTriangle, 
  Server,
  Eye,
  Lock 
} from 'lucide-react';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function SystemOverview() {
  const { user } = useAuth();
  const { isSuperAdmin, loading } = useSecureRoleValidation(user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isSuperAdmin) {
      navigate('/clinician/dashboard');
    }
  }, [loading, isSuperAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-red-900 flex items-center gap-2">
              <Shield className="h-8 w-8 text-red-600" />
              System Overview
            </h1>
            <p className="text-red-700 mt-1">Super Administrator Control Panel</p>
          </div>
          <Badge variant="destructive" className="px-4 py-2 text-sm">
            SUPER ADMIN ACCESS
          </Badge>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-red-200 hover:border-red-300 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/super-admin-dashboard')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">User Management</CardTitle>
              <Users className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">Manage</div>
              <p className="text-xs text-red-600">Control all user accounts</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 hover:border-red-300 transition-colors cursor-pointer"
                onClick={() => navigate('/admin/super-admin-panel')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">PHI Access</CardTitle>
              <Shield className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-900">Protected</div>
              <p className="text-xs text-red-600">Secure data access</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 hover:border-red-300 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">System Health</CardTitle>
              <Server className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-red-600">All systems operational</p>
            </CardContent>
          </Card>
          
          <Card className="border-red-200 hover:border-red-300 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-700">Security Status</CardTitle>
              <Lock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Secure</div>
              <p className="text-xs text-red-600">No threats detected</p>
            </CardContent>
          </Card>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Database Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Online</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Authentication Service</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-700">Security Monitoring</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">Enabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-red-600">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-400" />
                <p>No active alerts</p>
                <p className="text-sm">System is running normally</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
