
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: 'patient' | 'clinician';
};

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [isReady, setIsReady] = useState(false);
  const location = useLocation();
  
  // Add error boundary for auth context
  let user, userRole, isLoading;
  try {
    const authContext = useAuth();
    user = authContext.user;
    userRole = authContext.userRole;
    isLoading = authContext.isLoading;
  } catch (error) {
    console.error('Auth context error:', error);
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  useEffect(() => {
    // Small delay to ensure context is fully initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication or context isn't ready
  if (isLoading || !isReady) {
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
