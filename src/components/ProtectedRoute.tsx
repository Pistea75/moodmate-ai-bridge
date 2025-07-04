
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'clinician';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, userRole, isLoading } = useAuth();

  console.log('ProtectedRoute - Loading:', isLoading, 'User:', !!user, 'UserRole:', userRole, 'RequiredRole:', requiredRole);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('No user, redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
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
