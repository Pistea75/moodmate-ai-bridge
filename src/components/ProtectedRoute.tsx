
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'clinician';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, userRole, isLoading, authError, retryAuth } = useAuth();

  console.log('ProtectedRoute - Loading:', isLoading, 'User:', !!user, 'UserRole:', userRole, 'RequiredRole:', requiredRole, 'Error:', authError);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your account...</p>
          <p className="mt-2 text-sm text-muted-foreground">This should only take a moment</p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
          <div className="space-y-3">
            <Button onClick={retryAuth} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
            >
              Refresh Page
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/login'} 
              className="w-full"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If we have a user but no role yet, show a more specific loading state
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Setting up your account...</p>
          <p className="mt-2 text-sm text-muted-foreground">Loading your profile information</p>
        </div>
      </div>
    );
  }

  // If route requires specific role, verify it
  if (requiredRole && userRole !== requiredRole) {
    console.log('Role mismatch, redirecting. User role:', userRole, 'Required:', requiredRole);
    // Redirect to appropriate dashboard
    if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" replace />;
    } else if (userRole === 'clinician') {
      return <Navigate to="/clinician/dashboard" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  console.log('ProtectedRoute - Rendering children');
  return <>{children}</>;
}
