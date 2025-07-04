
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';

type UserRole = 'patient' | 'clinician' | null;

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  loading: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      } else {
        const role = data?.role as UserRole;
        console.log('User role fetched:', role);
        return role || null;
      }
    } catch (error) {
      console.error('Unexpected error fetching user role:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('Session found, setting user:', session.user.id);
          setUser(session.user);
          const role = await fetchUserRole(session.user.id);
          if (mounted) {
            setUserRole(role);
          }
        } else {
          console.log('No session found');
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, !!session?.user);
      
      if (session?.user) {
        setUser(session.user);
        const role = await fetchUserRole(session.user.id);
        if (mounted) {
          setUserRole(role);
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        
        // Only redirect on explicit sign out
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle redirects after authentication
  useEffect(() => {
    if (!loading && user && userRole) {
      const isOnPublicPage = ['/', '/features', '/about', '/contact', '/pricing', '/help', '/faq', '/privacy', '/terms', '/security', '/login'].includes(location.pathname) || location.pathname.startsWith('/signup');
      
      if (isOnPublicPage) {
        const dashboardPath = userRole === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
        console.log('Redirecting authenticated user to:', dashboardPath);
        navigate(dashboardPath, { replace: true });
      }
    }
  }, [user, userRole, loading, navigate, location.pathname]);

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
      isLoading: loading,
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
