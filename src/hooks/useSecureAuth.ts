
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateSession, authRateLimiter, logSecurityEvent, sessionManager } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

export function useSecureAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionWarning, setSessionWarning] = useState(false);

  const handleSessionTimeout = useCallback(() => {
    logSecurityEvent('session_timeout', 'authentication', { user_id: user?.id });
    secureSignOut();
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please sign in again.",
      variant: "destructive",
    });
  }, [user]);

  const handleSessionWarning = useCallback(() => {
    setSessionWarning(true);
    toast({
      title: "Session Expiring Soon",
      description: "Your session will expire in 5 minutes. Please save your work.",
      variant: "destructive",
    });
  }, []);

  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    console.log('🔒 Auth state change:', event);
    
    if (session && validateSession(session)) {
      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);
      setSessionWarning(false);
      
      // Start session timeout management
      sessionManager.startTimeout(handleSessionTimeout, handleSessionWarning);
      
      logSecurityEvent('auth_state_change', 'authentication', { 
        event,
        user_id: session.user.id 
      });
    } else {
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
      setSessionWarning(false);
      sessionManager.clearTimeout();
      
      if (session) {
        logSecurityEvent('invalid_session_detected', 'authentication', { event }, false);
      }
    }
    
    setLoading(false);
  }, [handleSessionTimeout, handleSessionWarning]);

  const secureSignOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Log security event before signing out
      await logSecurityEvent('user_signout', 'authentication', { user_id: user?.id });
      
      // Clear session timeout
      sessionManager.clearTimeout();
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      setSessionWarning(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        await logSecurityEvent('signout_error', 'authentication', { 
          error: error.message,
          user_id: user?.id 
        }, false);
        
        toast({
          title: "Sign Out Error",
          description: "There was an issue signing out. Please try again.",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      
      return true;
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      await logSecurityEvent('signout_unexpected_error', 'authentication', { 
        error: String(error),
        user_id: user?.id 
      }, false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const secureSignIn = useCallback(async (email: string, password: string) => {
    const clientId = `${email}_${Date.now()}`;
    
    // Enhanced rate limiting check with correct method signature
    if (!(await authRateLimiter.isAllowed(clientId, 'signin'))) {
      const remainingTime = Math.ceil((await authRateLimiter.getRemainingTime(clientId, 'signin')) / 1000 / 60);
      
      await logSecurityEvent('rate_limit_exceeded', 'authentication', { 
        email,
        remainingTime
      }, false);
      
      toast({
        title: "Too Many Attempts",
        description: `Account temporarily locked. Please wait ${remainingTime} minutes before trying again.`,
        variant: "destructive",
      });
      return false;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        
        await logSecurityEvent('signin_failed', 'authentication', { 
          email,
          error: error.message
        }, false);
        
        toast({
          title: "Sign In Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (!data.user || !data.session) {
        await logSecurityEvent('signin_incomplete', 'authentication', { email }, false);
        
        toast({
          title: "Sign In Failed",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Additional session validation
      if (!validateSession(data.session)) {
        await logSecurityEvent('invalid_session_created', 'authentication', { 
          email,
          user_id: data.user.id
        }, false);
        
        toast({
          title: "Authentication Error",
          description: "Invalid session created. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      // Reset rate limiter on successful login
      await authRateLimiter.reset(clientId, 'signin');

      // Log successful authentication
      await logSecurityEvent('signin_success', 'authentication', { 
        user_id: data.user.id,
        email: data.user.email
      });

      console.log('✅ Sign in successful - auth state change will handle redirect');
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
      console.error('🔴 Sign in error:', error);
      
      await logSecurityEvent('signin_unexpected_error', 'authentication', { 
        email,
        error: String(error)
      }, false);
      
      toast({
        title: "Sign In Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSession = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh error:', error);
        await logSecurityEvent('session_refresh_failed', 'authentication', { 
          error: error.message,
          user_id: user?.id
        }, false);
        await secureSignOut();
        return false;
      }
      
      if (data.session && validateSession(data.session)) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
        
        // Reset session timeout
        sessionManager.startTimeout(handleSessionTimeout, handleSessionWarning);
        
        await logSecurityEvent('session_refreshed', 'authentication', { 
          user_id: data.session.user.id
        });
        
        return true;
      }
      
      await logSecurityEvent('session_refresh_invalid', 'authentication', { 
        user_id: user?.id
      }, false);
      
      return false;
    } catch (error) {
      console.error('Unexpected session refresh error:', error);
      await logSecurityEvent('session_refresh_unexpected_error', 'authentication', { 
        error: String(error),
        user_id: user?.id
      }, false);
      return false;
    }
  }, [user, secureSignOut, handleSessionTimeout, handleSessionWarning]);

  const extendSession = useCallback(() => {
    if (isAuthenticated) {
      sessionManager.startTimeout(handleSessionTimeout, handleSessionWarning);
      setSessionWarning(false);
    }
  }, [isAuthenticated, handleSessionTimeout, handleSessionWarning]);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    const checkInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (mounted) {
          if (error) {
            console.error('Initial session check error:', error);
            await logSecurityEvent('initial_session_check_failed', 'authentication', { 
              error: error.message
            }, false);
            setLoading(false);
            return;
          }
          
          handleAuthStateChange('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('Unexpected session check error:', error);
        await logSecurityEvent('initial_session_check_unexpected_error', 'authentication', { 
          error: String(error)
        }, false);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      sessionManager.clearTimeout();
    };
  }, [handleAuthStateChange]);

  // Auto-refresh session when it's about to expire
  useEffect(() => {
    if (!session || !isAuthenticated) return;

    const expiresAt = session.expires_at;
    if (!expiresAt) return;

    const expiresInMs = (expiresAt * 1000) - Date.now();
    const refreshThreshold = 5 * 60 * 1000; // 5 minutes before expiry

    if (expiresInMs <= refreshThreshold) {
      refreshSession();
      return;
    }

    const refreshTimer = setTimeout(() => {
      refreshSession();
    }, expiresInMs - refreshThreshold);

    return () => clearTimeout(refreshTimer);
  }, [session, isAuthenticated, refreshSession]);

  return {
    user,
    session,
    loading,
    isAuthenticated,
    sessionWarning,
    secureSignOut,
    secureSignIn,
    refreshSession,
    extendSession,
  };
}
