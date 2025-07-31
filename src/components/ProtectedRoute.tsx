
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { AlertTriangle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'patient' | 'clinician' | 'super_admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth();
  const { userRole, hasRole, loading: roleLoading, error: roleError, isSuperAdmin } = useSecureRoleValidation(user);

  const loading = authLoading || roleLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Handle role verification errors
  if (roleError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Security Error</h2>
            <p className="text-muted-foreground">
              Unable to verify your account permissions. Please try signing in again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasRole([requiredRole])) {
    // Special handling for super admin role
    if (requiredRole === 'super_admin' && !isSuperAdmin) {
      // Redirect to appropriate dashboard based on verified user role
      if (userRole === 'clinician') {
        return <Navigate to="/clinician/dashboard" replace />;
      } else if (userRole === 'patient') {
        return <Navigate to="/patient/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }
    // Redirect to appropriate dashboard based on verified user role
    if (userRole === 'clinician' || isSuperAdmin) {
      return <Navigate to="/clinician/dashboard" replace />;
    } else if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
