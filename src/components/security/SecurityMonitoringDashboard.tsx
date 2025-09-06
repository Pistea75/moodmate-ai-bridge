import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle, Activity, Users, Clock } from 'lucide-react';

interface SecurityMetrics {
  totalSecurityEvents: number;
  highRiskEvents: number;
  failedAuthAttempts: number;
  suspiciousActivity: number;
  recentAlerts: Array<{
    id: string;
    action: string;
    resource: string;
    risk_score: number;
    created_at: string;
    success: boolean;
    details: any;
  }>;
}

/**
 * Security monitoring dashboard for super admins
 * Displays real-time security metrics and alerts
 */
export function SecurityMonitoringDashboard() {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    totalSecurityEvents: 0,
    highRiskEvents: 0,
    failedAuthAttempts: 0,
    suspiciousActivity: 0,
    recentAlerts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecurityMetrics();
    
    // Set up real-time subscription for security events
    const subscription = supabase
      .channel('security_monitoring')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'enhanced_security_logs' },
        () => {
          fetchSecurityMetrics();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSecurityMetrics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Check if user is super admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_super_admin) {
        console.warn('Unauthorized access to security dashboard');
        return;
      }

      // Fetch security metrics
      const { data: securityLogs } = await supabase
        .from('enhanced_security_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (securityLogs) {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const recentLogs = securityLogs.filter(log => 
          new Date(log.created_at) >= last24Hours
        );

        setMetrics({
          totalSecurityEvents: recentLogs.length,
          highRiskEvents: recentLogs.filter(log => (log.risk_score || 0) >= 50).length,
          failedAuthAttempts: recentLogs.filter(log => 
            log.action.includes('auth') && !log.success
          ).length,
          suspiciousActivity: recentLogs.filter(log => 
            (log.risk_score || 0) >= 25 && log.action !== 'phi_access'
          ).length,
          recentAlerts: securityLogs.slice(0, 10)
        });
      }
    } catch (error) {
      console.error('Failed to fetch security metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading security dashboard...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Security Monitoring Dashboard</h2>
      </div>

      {/* Security Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Events</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalSecurityEvents}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{metrics.highRiskEvents}</div>
            <p className="text-xs text-muted-foreground">Risk score ≥ 50</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Auth</CardTitle>
            <Users className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics.failedAuthAttempts}</div>
            <p className="text-xs text-muted-foreground">Authentication failures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <Shield className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{metrics.suspiciousActivity}</div>
            <p className="text-xs text-muted-foreground">Elevated risk events</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics.recentAlerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent security events</p>
            ) : (
              metrics.recentAlerts.map((alert) => (
                <Alert key={alert.id} variant={alert.risk_score >= 50 ? 'destructive' : 'default'}>
                  <Clock className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <div>
                        <strong>{alert.action}</strong> on {alert.resource}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(alert.created_at).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={alert.risk_score >= 50 ? 'destructive' : 'secondary'}>
                          Risk: {alert.risk_score}
                        </Badge>
                        <Badge variant={alert.success ? 'default' : 'destructive'}>
                          {alert.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}