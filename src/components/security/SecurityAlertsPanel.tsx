
import { useEnhancedSecurity } from './EnhancedSecurityProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, X, Shield } from 'lucide-react';

export function SecurityAlertsPanel() {
  const { securityAlerts, clearSecurityAlerts, getSecurityScore } = useEnhancedSecurity();

  if (securityAlerts.length === 0) {
    return null;
  }

  const securityScore = getSecurityScore();
  const alertVariant = securityScore < 50 ? 'destructive' : 'default';

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-2">
      <Alert variant={alertVariant}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center justify-between">
            <div>
              <strong>Security Alert</strong>
              <div className="text-sm mt-1">
                Security Score: {securityScore}/100
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSecurityAlerts}
              className="h-auto p-1"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      
      {securityAlerts.slice(0, 3).map((alert, index) => (
        <Alert key={index} variant={alertVariant}>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {alert}
          </AlertDescription>
        </Alert>
      ))}
      
      {securityAlerts.length > 3 && (
        <Alert variant="default">
          <AlertDescription className="text-sm">
            +{securityAlerts.length - 3} more security alerts
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
