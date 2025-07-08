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
    let roleCache = new Map<string, string>(); // Cache to prevent duplicate fetches

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          console.log('✅ Session found, setting user:', session.user.id);
          setUser(session.user);
          
          // Fetch role only once per user
          if (!roleCache.has(session.user.id)) {
            const role = await fetchUserRole(session.user.id);
            roleCache.set(session.user.id, role);
            
            if (mounted) {
              setUserRole(role as UserRole);
              setAuthError(null);
              
              // Only redirect if on public pages
              const isOnPublicPage = ['/', '/features', '/about', '/contact', '/pricing', '/help', '/faq', '/privacy', '/terms', '/security', '/login'].includes(location.pathname) || location.pathname.startsWith('/signup');
              if (isOnPublicPage) {
                redirectToDashboard(role);
              }
            }
          }
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('🔄 Auth state changed:', event, !!session?.user);
      
      if (event === 'SIGNED_IN' && session?.user) {
        const user = session.user;
        setUser(user);
        setLoading(false);
        
        // Only fetch role if not already cached
        if (!roleCache.has(user.id)) {
          try {
            const role = await fetchUserRole(user.id);
            roleCache.set(user.id, role);
            
            if (mounted) {
              setUserRole(role as UserRole);
              setAuthError(null);
              redirectToDashboard(role);
            }
          } catch (err) {
            console.warn("Role fetch failed during sign in:", err);
            if (mounted) {
              setUserRole('patient');
              setAuthError(null);
              redirectToDashboard('patient');
            }
          }
        } else {
          // Use cached role
          const cachedRole = roleCache.get(user.id)!;
          setUserRole(cachedRole as UserRole);
          redirectToDashboard(cachedRole);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setUserRole(null);
        setLoading(false);
        setAuthError(null);
        roleCache.clear(); // Clear cache on sign out
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        setAuthError(null);
        // Don't refetch role on token refresh, keep existing role
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
