
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'clinician';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, userRole, isLoading, authError, retryAuth } = useAuth();

  console.log('ProtectedRoute - Loading:', isLoading, 'User:', !!user, 'UserRole:', userRole, 'RequiredRole:', requiredRole, 'Error:', authError);

  // Show enhanced loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <CheckCircle className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" />
          </div>
          <p className="mt-4 text-lg font-medium">Loading your account...</p>
          <p className="mt-2 text-sm text-muted-foreground">Setting up your personalized experience</p>
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
            <div className="bg-primary h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Show enhanced error state with better recovery options
  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-left">
              <strong>Authentication Error</strong>
              <br />
              {authError}
            </AlertDescription>
          </Alert>
          <div className="space-y-3">
            <Button onClick={retryAuth} className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Authentication
            </Button>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()} 
              className="w-full"
              size="lg"
            >
              Refresh Page
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/login'} 
              className="w-full"
              size="lg"
            >
              Return to Login
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Simple loading state if no role yet
  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
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
