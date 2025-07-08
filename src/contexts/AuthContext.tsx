
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
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserRole = async (userId: string, attempt: number = 1): Promise<UserRole> => {
    try {
      console.log(`Fetching user role for: ${userId} (attempt ${attempt})`);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        if (attempt < 3) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          return fetchUserRole(userId, attempt + 1);
        }
        throw error;
      }

      if (!data) {
        console.log('No profile found, creating default profile...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            role: 'patient',
            first_name: '',
            last_name: '',
            language: 'en'
          });
        
        if (insertError) {
          console.error('Error creating default profile:', insertError);
          throw insertError;
        }
        
        return 'patient';
      }

      const role = data.role as UserRole;
      console.log('User role fetched successfully:', role);
      return role || 'patient';
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      return 'patient'; // Fallback to patient role
    }
  };

  const retryAuth = async () => {
    if (!user) return;
    
    setAuthError(null);
    setRetryCount(prev => prev + 1);
    
    try {
      const role = await fetchUserRole(user.id);
      setUserRole(role);
    } catch (error) {
      console.error('Retry auth failed:', error);
      setAuthError('Authentication retry failed. Please refresh the page.');
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
          setAuthError('Failed to initialize authentication. Please refresh the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, !!session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        setLoading(true);
        
        try {
          const role = await fetchUserRole(session.user.id);
          if (mounted) {
            setUserRole(role);
            setAuthError(null);
          }
        } catch (error) {
          console.error('Error fetching role after sign in:', error);
          if (mounted) {
            setAuthError('Failed to load user profile. Please try again.');
          }
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        setAuthError(null);
        navigate('/login');
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
  }, [navigate, retryCount]);

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
