
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { logSecurityEvent } from '@/utils/securityUtils';

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
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use secure role validation hook
  const { userRole: secureUserRole, loading: roleLoading, error: roleError, refreshRole } = useSecureRoleValidation(user);
  
  // Convert secure role to legacy format for backward compatibility
  const userRole = secureUserRole as UserRole;

  const redirectToDashboard = (role: string) => {
    const dashboardPath = role === 'clinician' ? '/clinician/dashboard' : '/patient/dashboard';
    console.log('🔄 Redirecting to dashboard:', dashboardPath);
    navigate(dashboardPath, { replace: true });
  };

  const retryAuth = async () => {
    if (!user) return;
    
    setAuthError(null);
    
    try {
      await refreshRole();
      if (secureUserRole) {
        redirectToDashboard(secureUserRole);
      }
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
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('🔴 Session error:', error);
          setAuthError('Failed to retrieve session. Please try logging in again.');
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('✅ Session found, setting user:', session.user.id);
          setUser(session.user);
          setAuthError(null);
          
          // Log successful session initialization
          logSecurityEvent('session_init', 'authentication', { 
            user_id: session.user.id 
          }, true);
        } else {
          console.log('ℹ️ No session found');
          setUser(null);
        }
      } catch (error) {
        console.error('🔴 Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setAuthError('Failed to initialize authentication. Please refresh the page.');
          
          // Log failed session initialization
          logSecurityEvent('session_init_failed', 'authentication', { 
            error: String(error) 
          }, false);
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
        setUser(session.user);
        setLoading(false);
        setAuthError(null);
        
        // Log successful sign in
        logSecurityEvent('sign_in', 'authentication', { 
          user_id: session.user.id 
        }, true);
        
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        setAuthError(null);
        
        // Log sign out
        logSecurityEvent('sign_out', 'authentication', {}, true);
        
        navigate('/login', { replace: true });
      } else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        setAuthError(null);
        
        // Log token refresh
        logSecurityEvent('token_refresh', 'authentication', { 
          user_id: session.user.id 
        }, true);
      }
    });

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  // Handle role errors
  useEffect(() => {
    if (roleError) {
      setAuthError(`Role verification failed: ${roleError}`);
      
      // Log role verification failure
      logSecurityEvent('role_verification_failed', 'authorization', { 
        error: roleError,
        user_id: user?.id 
      }, false);
    }
  }, [roleError, user?.id]);

  // Handle redirects ONLY for public pages, not on all navigation
  useEffect(() => {
    if (user && secureUserRole && !roleLoading && !loading) {
      // Only redirect from truly public pages, NOT from authenticated routes
      const publicPages = ['/', '/features', '/about', '/contact', '/pricing', '/help', '/faq', '/privacy', '/terms', '/security', '/login'];
      const isOnPublicPage = publicPages.includes(location.pathname) || location.pathname.startsWith('/signup');
      
      if (isOnPublicPage) {
        redirectToDashboard(secureUserRole);
      }
    }
  }, [user, secureUserRole, roleLoading, loading, location.pathname]);

  const signOut = async () => {
    try {
      setAuthError(null);
      
      // Log sign out attempt
      logSecurityEvent('sign_out_attempt', 'authentication', { 
        user_id: user?.id 
      }, true);
      
      console.log('🔄 Signing out user...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Supabase signOut error:', error);
        throw error;
      }
      
      console.log('✅ Sign out completed');
    } catch (error) {
      console.error('❌ Sign out failed:', error);
      setAuthError('Failed to sign out. Please try again.');
      throw error;
    }
  };

  const deleteAccount = async () => {
    if (!user) throw new Error('No user logged in');
    
    // Log account deletion attempt
    logSecurityEvent('account_deletion_attempt', 'user_management', { 
      user_id: user.id 
    }, true);
    
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
      loading: loading || roleLoading, 
      isLoading: loading || roleLoading,
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
