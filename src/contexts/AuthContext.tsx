
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
  authError: string | null;
  retryAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserRole = async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data?.role) return data.role;

      // Create default profile if none exists
      await supabase.from('profiles').insert([{ id: userId, role: 'patient' }]);
      return 'patient';
    } catch (err: any) {
      console.error("Error fetching/creating profile:", err.message);
      return 'patient'; // fallback
    }
  };

  const redirectToDashboard = (role: string) => {
    const dashboardPath = role === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
    console.log('🔄 Redirecting to dashboard:', dashboardPath);
    navigate(dashboardPath, { replace: true });
  };

  const retryAuth = async () => {
    if (!user) return;
    
    setAuthError(null);
    
    try {
      const role = await fetchUserRole(user.id);
      setUserRole(role as UserRole);
      redirectToDashboard(role);
    } catch (error) {
      console.error('🔴 Retry auth failed:', error);
      setAuthError('Authentication retry failed. Please refresh the page.');
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('✅ Session found, setting user:', session.user.id);
          setUser(session.user);
          
          // Set optimistic role and redirect immediately
          setUserRole('patient');
          
          const isOnPublicPage = ['/', '/features', '/about', '/contact', '/pricing', '/help', '/faq', '/privacy', '/terms', '/security', '/login'].includes(location.pathname) || location.pathname.startsWith('/signup');
          if (isOnPublicPage) {
            redirectToDashboard('patient');
          }
          
          // Fetch actual role in background
          fetchUserRole(session.user.id)
            .then((role) => {
              if (mounted) {
                setUserRole(role as UserRole);
                setAuthError(null);
              }
            })
            .catch((err) => {
              console.warn("Role fetch failed, using fallback:", err.message);
            });
        } else {
          console.log('ℹ️ No session found');
          setUser(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('🔴 Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setUserRole(null);
          setAuthError('Failed to initialize authentication. Please refresh the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, !!session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        setUser(user);
        setLoading(false);
        
        // Optimistic fallback - redirect immediately
        setUserRole('patient');
        redirectToDashboard('patient');
        
        // Fetch role in background (won't block UI)
        fetchUserRole(user.id)
          .then((role) => {
            if (mounted) {
              setUserRole(role as UserRole);
              setAuthError(null);
            }
          })
          .catch((err) => {
            console.warn("Role fetch failed, using fallback:", err.message);
          });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        setAuthError(null);
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        setAuthError(null);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signOut = async () => {
    setAuthError(null);
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
      deleteAccount,
      authError,
      retryAuth
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
