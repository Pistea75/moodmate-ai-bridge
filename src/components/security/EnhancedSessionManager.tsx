import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logEnhancedSecurityEvent } from '@/utils/enhancedSecurityUtils';

interface EnhancedSessionManagerProps {
  children: React.ReactNode;
}

export function EnhancedSessionManager({ children }: EnhancedSessionManagerProps) {
  const { toast } = useToast();

  const handleSessionValidation = useCallback(async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session validation error:', error);
        await logEnhancedSecurityEvent({
          action: 'session_validation_error',
          resource: 'auth_session',
          success: false,
          details: { error: error.message }
        });
        return;
      }

      if (session) {
        // Check if session is about to expire (within 5 minutes)
        const expiresAt = new Date(session.expires_at! * 1000);
        const now = new Date();
        const timeUntilExpiry = expiresAt.getTime() - now.getTime();
        const fiveMinutes = 5 * 60 * 1000;

        if (timeUntilExpiry <= fiveMinutes && timeUntilExpiry > 0) {
          toast({
            title: "Session Expiring Soon",
            description: "Your session will expire in 5 minutes. Please save your work.",
            variant: "destructive",
          });

          await logEnhancedSecurityEvent({
            action: 'session_expiry_warning',
            resource: 'auth_session',
            success: true,
            details: { time_until_expiry: timeUntilExpiry }
          });
        }

        // Auto-refresh session if it's within 10 minutes of expiry
        if (timeUntilExpiry <= 10 * 60 * 1000 && timeUntilExpiry > 0) {
          const { error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshError) {
            await logEnhancedSecurityEvent({
              action: 'session_refresh_failed',
              resource: 'auth_session',
              success: false,
              details: { error: refreshError.message }
            });
          } else {
            await logEnhancedSecurityEvent({
              action: 'session_auto_refreshed',
              resource: 'auth_session',
              success: true
            });
          }
        }
      }
    } catch (error) {
      console.error('Session management error:', error);
      await logEnhancedSecurityEvent({
        action: 'session_management_error',
        resource: 'auth_session',
        success: false,
        details: { error: error.message }
      });
    }
  }, [toast]);

  const detectSuspiciousActivity = useCallback(async () => {
    try {
      // Check for multiple concurrent sessions
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Monitor for session fixation attempts
      const sessionId = session.access_token.substring(0, 16);
      const storedSessionId = localStorage.getItem('session_fingerprint');

      if (storedSessionId && storedSessionId !== sessionId) {
        await logEnhancedSecurityEvent({
          action: 'potential_session_fixation',
          resource: 'auth_session',
          success: false,
          details: {
            stored_session: storedSessionId,
            current_session: sessionId
          },
          riskScore: 80
        });

        toast({
          title: "Security Alert",
          description: "Unusual session activity detected. Please sign in again for security.",
          variant: "destructive",
        });

        // Force logout for security
        await supabase.auth.signOut();
        return;
      }

      // Store current session fingerprint
      localStorage.setItem('session_fingerprint', sessionId);

    } catch (error) {
      console.error('Suspicious activity detection error:', error);
    }
  }, [toast]);

  useEffect(() => {
    // Initial session validation
    handleSessionValidation();

    // Periodic session validation every 2 minutes
    const sessionInterval = setInterval(handleSessionValidation, 2 * 60 * 1000);

    // Suspicious activity monitoring every 30 seconds
    const securityInterval = setInterval(detectSuspiciousActivity, 30 * 1000);

    // Monitor for tab/window visibility changes
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        await handleSessionValidation();
        await detectSuspiciousActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(sessionInterval);
      clearInterval(securityInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleSessionValidation, detectSuspiciousActivity]);

  return <>{children}</>;
}