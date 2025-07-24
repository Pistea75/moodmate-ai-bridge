
import { useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { validateSession, authRateLimiter } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

export function useSecureAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthStateChange = useCallback((event: string, session: Session | null) => {
    console.log('🔒 Auth state change:', event);
    
    if (session && validateSession(session)) {
      setSession(session);
      setUser(session.user);
      setIsAuthenticated(true);
    } else {
      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  }, []);

  const secureSignOut = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear local state first
      setUser(null);
      setSession(null);
      setIsAuthenticated(false);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
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
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const secureSignIn = useCallback(async (email: string, password: string) => {
    const clientId = `${email}_${Date.now()}`;
    
    if (!authRateLimiter.isAllowed(clientId)) {
      const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000 / 60);
      toast({
        title: "Too Many Attempts",
        description: `Please wait ${remainingTime} minutes before trying again.`,
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
        toast({
          title: "Sign In Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      if (!data.user || !data.session) {
        toast({
          title: "Sign In Failed",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected sign in error:', error);
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
        await secureSignOut();
        return false;
      }
      
      if (data.session && validateSession(data.session)) {
        setSession(data.session);
        setUser(data.session.user);
        setIsAuthenticated(true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected session refresh error:', error);
      return false;
    }
  }, [secureSignOut]);

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
            setLoading(false);
            return;
          }
          
          handleAuthStateChange('INITIAL_SESSION', session);
        }
      } catch (error) {
        console.error('Unexpected session check error:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
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
    secureSignOut,
    secureSignIn,
    refreshSession,
  };
}
