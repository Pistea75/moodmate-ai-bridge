
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

type UserRole = 'patient' | 'clinician' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  isLoading: boolean; // Add missing property
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>; // Add missing property
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [hasInitialized, setHasInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
        setHasInitialized(true);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, !!session?.user);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserRole(session.user.id);
      } else {
        setUserRole(null);
        setLoading(false);
        
        // Only redirect to login on sign out, not on initial load or tab focus
        if (event === 'SIGNED_OUT' && hasInitialized) {
          navigate('/login');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, hasInitialized]);

  // Only redirect to dashboard on initial authentication, not on every auth state change
  useEffect(() => {
    if (hasInitialized && user && userRole && !loading) {
      const isOnLoginPage = location.pathname === '/login';
      const isOnSignupPage = location.pathname.startsWith('/signup');
      const isOnPublicPage = ['/', '/features', '/about', '/contact', '/privacy', '/terms'].includes(location.pathname);
      
      // Only redirect if user is on a public page, login, or signup page
      if (isOnLoginPage || isOnSignupPage || isOnPublicPage) {
        const dashboardPath = userRole === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [user, userRole, loading, hasInitialized, navigate, location.pathname]);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null);
      } else {
        // Fix type error by ensuring proper type casting
        const role = data?.role as UserRole;
        setUserRole(role || null);
      }
    } catch (error) {
      console.error('Unexpected error fetching user role:', error);
      setUserRole(null);
    } finally {
      setLoading(false);
      setHasInitialized(true);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('No user logged in');
    
    const { error } = await supabase.functions.invoke('delete-user', {
      body: { userId: user.id }
    });
    
    if (error) throw error;
    
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      loading, 
      isLoading: loading, // Provide both for compatibility
      signOut,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
