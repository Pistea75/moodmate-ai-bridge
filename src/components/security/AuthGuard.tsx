
import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { AlertTriangle, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string | string[];
  fallbackPath?: string;
  showFallback?: boolean;
}

export function AuthGuard({ 
  children, 
  requiredRole, 
  fallbackPath = '/login',
  showFallback = false 
}: AuthGuardProps) {
  const { user, loading: authLoading, isAuthenticated, secureSignOut } = useSecureAuth();
  const { userRole, hasRole, loading: roleLoading, error: roleError } = useSecureRoleValidation(user);
  const location = useLocation();

  const loading = authLoading || roleLoading;

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary animate-pulse" />
          <div className="text-lg font-medium">Verifying authentication...</div>
        </div>
      </div>
    );
  }

  // Handle role verification errors
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Security Verification Failed</h2>
                <p className="text-muted-foreground mb-4">
                  Unable to verify your account permissions.
                </p>
                <p className="text-sm text-red-600">
                  Error: {roleError}
                </p>
              </div>
              <Button 
                onClick={secureSignOut}
                variant="destructive"
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role permissions if required
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!hasRole(allowedRoles)) {
      if (showFallback) {
        return (
          <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto" />
                  <div>
                    <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
                    <p className="text-muted-foreground mb-4">
                      You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Required role: {allowedRoles.join(' or ')}
                      <br />
                      Your role: {userRole || 'none'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      onClick={() => window.history.back()}
                      variant="outline"
                      className="w-full"
                    >
                      Go Back
                    </Button>
                    <Button 
                      onClick={secureSignOut}
                      variant="destructive"
                      className="w-full"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      }
      
      // Redirect based on verified user role
      const redirectPath = userRole === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
}
