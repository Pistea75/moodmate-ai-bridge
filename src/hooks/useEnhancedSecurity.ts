
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  logEnhancedSecurityEvent, 
  authRateLimiter, 
  invalidateSessionOnRoleChange 
} from '@/utils/enhancedSecurityUtils';

export function useEnhancedSecurity() {
  const { user, userRole } = useAuth();
  const [securityAlerts, setSecurityAlerts] = useState<string[]>([]);
  const [previousRole, setPreviousRole] = useState<string | null>(null);

  // Monitor for role changes
  useEffect(() => {
    if (userRole && previousRole && userRole !== previousRole) {
      invalidateSessionOnRoleChange(previousRole, userRole);
    }
    setPreviousRole(userRole);
  }, [userRole, previousRole]);

  // Track user activity for security monitoring
  const trackSecurityEvent = useCallback(async (action: string, resource: string, details?: Record<string, any>) => {
    await logEnhancedSecurityEvent({
      action,
      resource,
      details,
      success: true
    });
  }, []);

  // Check if action is rate limited
  const checkRateLimit = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;
    
    const identifier = `${user.id}_${action}`;
    const isAllowed = await authRateLimiter.isAllowed(identifier, action);
    
    if (!isAllowed) {
      setSecurityAlerts(prev => [...prev, `Rate limit exceeded for ${action}`]);
    }
    
    return isAllowed;
  }, [user]);

  // Clear security alerts
  const clearSecurityAlerts = useCallback(() => {
    setSecurityAlerts([]);
  }, []);

  // Monitor for suspicious activity patterns
  useEffect(() => {
    const monitorActivity = () => {
      // Track page visibility changes
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          trackSecurityEvent('page_hidden', 'navigation');
        } else {
          trackSecurityEvent('page_visible', 'navigation');
        }
      });

      // Track focus changes
      window.addEventListener('focus', () => {
        trackSecurityEvent('window_focus', 'navigation');
      });

      window.addEventListener('blur', () => {
        trackSecurityEvent('window_blur', 'navigation');
      });
    };

    if (user) {
      monitorActivity();
    }

    return () => {
      document.removeEventListener('visibilitychange', () => {});
      window.removeEventListener('focus', () => {});
      window.removeEventListener('blur', () => {});
    };
  }, [user, trackSecurityEvent]);

  return {
    securityAlerts,
    clearSecurityAlerts,
    trackSecurityEvent,
    checkRateLimit
  };
}
