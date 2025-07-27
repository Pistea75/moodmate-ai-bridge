
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { 
  logEnhancedSecurityEvent, 
  authRateLimiter, 
  csrfManager,
  invalidateSessionOnRoleChange 
} from '@/utils/enhancedSecurityUtils';
import { useAuth } from '@/contexts/AuthContext';

interface EnhancedSecurityContextType {
  securityAlerts: string[];
  clearSecurityAlerts: () => void;
  trackSecurityEvent: (action: string, resource: string, details?: Record<string, any>) => Promise<void>;
  checkRateLimit: (action: string) => Promise<boolean>;
  generateCSRFToken: () => Promise<string>;
  validateCSRFToken: (token: string) => Promise<boolean>;
  getSecurityScore: () => number;
}

const EnhancedSecurityContext = createContext<EnhancedSecurityContextType | undefined>(undefined);

interface EnhancedSecurityProviderProps {
  children: ReactNode;
}

export function EnhancedSecurityProvider({ children }: EnhancedSecurityProviderProps) {
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
  const trackSecurityEvent = async (action: string, resource: string, details?: Record<string, any>) => {
    await logEnhancedSecurityEvent({
      action,
      resource,
      details,
      success: true
    });
  };

  // Check if action is rate limited
  const checkRateLimit = async (action: string): Promise<boolean> => {
    if (!user) return false;
    
    const identifier = `${user.id}_${action}`;
    const isAllowed = await authRateLimiter.isAllowed(identifier, action);
    
    if (!isAllowed) {
      setSecurityAlerts(prev => [...prev, `Rate limit exceeded for ${action}`]);
      await trackSecurityEvent('rate_limit_exceeded', action, { user_id: user.id });
      
      // Decrease security score
      setSecurityScore(prev => Math.max(0, prev - 10));
    }
    
    return isAllowed;
  };

  // Generate CSRF token
  const generateCSRFToken = async (): Promise<string> => {
    return await csrfManager.generateToken();
  };

  // Validate CSRF token
  const validateCSRFToken = async (token: string): Promise<boolean> => {
    const isValid = await csrfManager.validateToken(token);
    
    if (!isValid) {
      setSecurityAlerts(prev => [...prev, 'Invalid CSRF token detected']);
      await trackSecurityEvent('csrf_validation_failed', 'security', { token: token.substring(0, 8) + '...' });
      
      // Decrease security score significantly
      setSecurityScore(prev => Math.max(0, prev - 25));
    }
    
    return isValid;
  };

  // Clear security alerts
  const clearSecurityAlerts = () => {
    setSecurityAlerts([]);
  };

  // Get current security score
  const getSecurityScore = (): number => {
    return securityScore;
  };

  // Monitor for suspicious activity patterns
  useEffect(() => {
    const monitorActivity = () => {
      let idleTime = 0;
      let lastActivity = Date.now();
      
      const resetIdleTime = () => {
        idleTime = 0;
        lastActivity = Date.now();
      };
      
      const checkIdleTime = () => {
        idleTime += 1000;
        
        // Track extended idle periods
        if (idleTime >= 30 * 60 * 1000) { // 30 minutes
          trackSecurityEvent('extended_idle', 'session', { 
            idleTime: idleTime / 1000,
            lastActivity 
          });
        }
      };
      
      // Track various user interactions
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      events.forEach(event => {
        document.addEventListener(event, resetIdleTime, true);
      });
      
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
      
      // Check idle time every second
      const idleInterval = setInterval(checkIdleTime, 1000);
      
      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetIdleTime, true);
        });
        document.removeEventListener('visibilitychange', () => {});
        window.removeEventListener('focus', () => {});
        window.removeEventListener('blur', () => {});
        clearInterval(idleInterval);
      };
    };

    if (user) {
      const cleanup = monitorActivity();
      return cleanup;
    }
  }, [user]);

  // Periodic security score recovery
  useEffect(() => {
    const interval = setInterval(() => {
      setSecurityScore(prev => Math.min(100, prev + 1));
    }, 60000); // Recover 1 point per minute

    return () => clearInterval(interval);
  }, []);

  return (
    <EnhancedSecurityContext.Provider value={{
      securityAlerts,
      clearSecurityAlerts,
      trackSecurityEvent,
      checkRateLimit,
      generateCSRFToken,
      validateCSRFToken,
      getSecurityScore
    }}>
      {children}
    </EnhancedSecurityContext.Provider>
  );
}

export function useEnhancedSecurity() {
  const context = useContext(EnhancedSecurityContext);
  if (context === undefined) {
    throw new Error('useEnhancedSecurity must be used within an EnhancedSecurityProvider');
  }
  return context;
}
