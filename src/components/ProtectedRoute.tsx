
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'clinician';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If route requires specific role, verify it
  if (requiredRole && userRole !== requiredRole) {
    // Redirect to appropriate dashboard or login
    if (userRole === 'patient') {
      return <Navigate to="/patient/dashboard" />;
    } else if (userRole === 'clinician') {
      return <Navigate to="/clinician/dashboard" />;
    } else {
      return <Navigate to="/login" />;
    }
  }

  return <>{children}</>;
}
