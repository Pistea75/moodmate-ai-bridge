
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
  const [securityScore, setSecurityScore] = useState(100);

  // Monitor for role changes
  useEffect(() => {
    if (userRole && previousRole && userRole !== previousRole) {
      invalidateSessionOnRoleChange(previousRole, userRole);
      trackSecurityEvent('role_change', 'authorization', { 
        from: previousRole, 
        to: userRole 
      });
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

  // Enhanced rate limiting with progressive penalties
  const checkRateLimit = useCallback(async (action: string): Promise<boolean> => {
    if (!user) return false;
    
    const identifier = `${user.id}_${action}`;
    const isAllowed = await authRateLimiter.isAllowed(identifier, action);
    
    if (!isAllowed) {
      setSecurityAlerts(prev => [...prev, `Rate limit exceeded for ${action}`]);
      await trackSecurityEvent('rate_limit_exceeded', action, { user_id: user.id });
      
      // Decrease security score with progressive penalties
      const currentPenalty = Math.min(25, securityScore * 0.1);
      setSecurityScore(prev => Math.max(0, prev - currentPenalty));
    }
    
    return isAllowed;
  }, [user, securityScore, trackSecurityEvent]);

  // Clear security alerts with logging
  const clearSecurityAlerts = useCallback(() => {
    if (securityAlerts.length > 0) {
      trackSecurityEvent('security_alerts_cleared', 'security', {
        alertCount: securityAlerts.length,
        alerts: securityAlerts
      });
    }
    setSecurityAlerts([]);
  }, [securityAlerts, trackSecurityEvent]);

  // Get current security score
  const getSecurityScore = useCallback((): number => {
    return securityScore;
  }, [securityScore]);

  // Enhanced activity monitoring with better event tracking
  useEffect(() => {
    const monitorActivity = () => {
      let idleTime = 0;
      let lastActivity = Date.now();
      let suspiciousActivityCount = 0;
      
      const resetIdleTime = () => {
        idleTime = 0;
        lastActivity = Date.now();
      };
      
      const checkIdleTime = () => {
        idleTime += 1000;
        
        // Track extended idle periods with warnings
        if (idleTime === 15 * 60 * 1000) { // 15 minutes warning
          trackSecurityEvent('idle_warning', 'session', { 
            idleTime: idleTime / 1000 
          });
        }
        
        if (idleTime >= 30 * 60 * 1000) { // 30 minutes critical
          trackSecurityEvent('extended_idle', 'session', { 
            idleTime: idleTime / 1000,
            lastActivity 
          });
        }
      };
      
      // Enhanced event tracking with suspicious activity detection
      const trackUserEvent = (eventType: string) => {
        resetIdleTime();
        
        // Track rapid consecutive events as potentially suspicious
        const now = Date.now();
        if (now - lastActivity < 100) { // Less than 100ms between events
          suspiciousActivityCount++;
          
          if (suspiciousActivityCount > 10) {
            trackSecurityEvent('suspicious_rapid_activity', 'user_interaction', {
              eventType,
              rapidEventCount: suspiciousActivityCount
            });
            suspiciousActivityCount = 0; // Reset counter
          }
        } else {
          suspiciousActivityCount = 0;
        }
        
        lastActivity = now;
      };
      
      // Track various user interactions
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, () => trackUserEvent(event), true);
      });
      
      // Track page visibility changes with enhanced context
      const handleVisibilityChange = () => {
        const isHidden = document.visibilityState === 'hidden';
        trackSecurityEvent(
          isHidden ? 'page_hidden' : 'page_visible', 
          'navigation',
          {
            url: window.location.href,
            timestamp: new Date().toISOString(),
            idleTime: idleTime / 1000
          }
        );
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Track focus changes with context
      const handleFocusChange = (type: 'focus' | 'blur') => {
        trackSecurityEvent(`window_${type}`, 'navigation', {
          url: window.location.href,
          timestamp: new Date().toISOString()
        });
      };

      window.addEventListener('focus', () => handleFocusChange('focus'));
      window.addEventListener('blur', () => handleFocusChange('blur'));
      
      // Check idle time every second
      const idleInterval = setInterval(checkIdleTime, 1000);
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, () => trackUserEvent(event), true);
        });
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        window.removeEventListener('focus', () => handleFocusChange('focus'));
        window.removeEventListener('blur', () => handleFocusChange('blur'));
        clearInterval(idleInterval);
      };
    };

    if (user) {
      const cleanup = monitorActivity();
      return cleanup;
    }
  }, [user, trackSecurityEvent]);

  // Enhanced security score recovery with context-aware adjustments
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityScore(prev => {
        const recovery = Math.min(100, prev + 1);
        
        // Log significant security score changes
        if (prev < 50 && recovery >= 50) {
          trackSecurityEvent('security_score_recovered', 'security', {
            previousScore: prev,
            newScore: recovery
          });
        }
        
        return recovery;
      });
    }, 60000); // Recover 1 point per minute

    return () => clearInterval(interval);
  }, [trackSecurityEvent]);

  return {
    securityAlerts,
    clearSecurityAlerts,
    trackSecurityEvent,
    checkRateLimit,
    getSecurityScore,
    securityScore
  };
}
