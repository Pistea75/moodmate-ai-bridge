
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced security utilities with database integration
 */

export interface SecurityEvent {
  action: string;
  resource: string;
  details?: Record<string, any>;
  success?: boolean;
  riskScore?: number;
}

/**
 * Enhanced security logging with database persistence
 */
export const logEnhancedSecurityEvent = async (event: SecurityEvent) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const logEntry = {
      user_id: user?.id || null,
      action: event.action,
      resource: event.resource,
      success: event.success ?? true,
      risk_score: event.riskScore ?? 0,
      details: {
        ...event.details,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    const { error } = await supabase
      .from('enhanced_security_logs')
      .insert([logEntry]);

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Error in security logging:', error);
  }
};

/**
 * CSRF token management
 */
export class CSRFTokenManager {
  private static instance: CSRFTokenManager;
  private currentToken: string | null = null;

  static getInstance(): CSRFTokenManager {
    if (!CSRFTokenManager.instance) {
      CSRFTokenManager.instance = new CSRFTokenManager();
    }
    return CSRFTokenManager.instance;
  }

  async generateToken(): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Generate a secure token
      const token = this.generateSecureToken(32);
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

      const { error } = await supabase
        .from('csrf_tokens')
        .insert([{
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString()
        }]);

      if (error) {
        console.error('Failed to store CSRF token:', error);
        return null;
      }

      this.currentToken = token;
      return token;
    } catch (error) {
      console.error('Error generating CSRF token:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('csrf_tokens')
        .select('*')
        .eq('user_id', user.id)
        .eq('token', token)
        .eq('used', false)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (error || !data) {
        await logEnhancedSecurityEvent({
          action: 'csrf_token_validation_failed',
          resource: 'authentication',
          success: false,
          details: { token: token.substring(0, 8) + '...' }
        });
        return false;
      }

      // Mark token as used
      await supabase
        .from('csrf_tokens')
        .update({ used: true })
        .eq('id', data.id);

      return true;
    } catch (error) {
      console.error('Error validating CSRF token:', error);
      return false;
    }
  }

  private generateSecureToken(length: number): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  getCurrentToken(): string | null {
    return this.currentToken;
  }
}

/**
 * Enhanced rate limiting with database persistence
 */
export class EnhancedRateLimiter {
  constructor(
    private maxAttempts: number = 5,
    private windowMinutes: number = 15,
    private blockMinutes: number = 30
  ) {}

  async isAllowed(identifier: string, actionType: string): Promise<boolean> {
    try {
      const windowStart = new Date();
      windowStart.setMinutes(windowStart.getMinutes() - this.windowMinutes);

      // Check existing attempts
      const { data: attempts, error } = await supabase
        .from('rate_limit_attempts')
        .select('*')
        .eq('identifier', identifier)
        .eq('action_type', actionType)
        .gte('window_start', windowStart.toISOString())
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Rate limit check error:', error);
        return true; // Fail open
      }

      const now = new Date();

      // Check if currently blocked
      if (attempts?.blocked_until && new Date(attempts.blocked_until) > now) {
        await logEnhancedSecurityEvent({
          action: 'rate_limit_blocked',
          resource: actionType,
          success: false,
          riskScore: 80,
          details: { identifier, actionType }
        });
        return false;
      }

      // If no attempts or window expired, allow and create/reset
      if (!attempts || new Date(attempts.window_start) < windowStart) {
        await this.updateAttempts(identifier, actionType, 1, now, null);
        return true;
      }

      // Check if under limit
      if (attempts.attempt_count < this.maxAttempts) {
        await this.updateAttempts(
          identifier, 
          actionType, 
          attempts.attempt_count + 1, 
          new Date(attempts.window_start), 
          null
        );
        return true;
      }

      // Block user
      const blockedUntil = new Date();
      blockedUntil.setMinutes(blockedUntil.getMinutes() + this.blockMinutes);
      
      await this.updateAttempts(
        identifier, 
        actionType, 
        attempts.attempt_count + 1, 
        new Date(attempts.window_start), 
        blockedUntil
      );

      await logEnhancedSecurityEvent({
        action: 'rate_limit_exceeded',
        resource: actionType,
        success: false,
        riskScore: 90,
        details: { identifier, actionType, attempts: attempts.attempt_count + 1 }
      });

      return false;
    } catch (error) {
      console.error('Rate limiter error:', error);
      return true; // Fail open
    }
  }

  private async updateAttempts(
    identifier: string,
    actionType: string,
    attemptCount: number,
    windowStart: Date,
    blockedUntil: Date | null
  ) {
    const { error } = await supabase
      .from('rate_limit_attempts')
      .upsert({
        identifier,
        action_type: actionType,
        attempt_count: attemptCount,
        window_start: windowStart.toISOString(),
        blocked_until: blockedUntil?.toISOString() || null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'identifier,action_type'
      });

    if (error) {
      console.error('Failed to update rate limit attempts:', error);
    }
  }
}

/**
 * Content Security Policy helper
 */
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return btoa(String.fromCharCode(...array));
};

/**
 * Session invalidation on role changes
 */
export const invalidateSessionOnRoleChange = async (oldRole: string, newRole: string) => {
  if (oldRole !== newRole) {
    await logEnhancedSecurityEvent({
      action: 'role_change_detected',
      resource: 'authentication',
      details: { oldRole, newRole },
      riskScore: 60
    });

    // Force re-authentication by signing out
    await supabase.auth.signOut();
  }
};

/**
 * Input sanitization for different security contexts
 */
export const sanitizeForContext = {
  html: (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },
  
  sql: (input: string): string => {
    return input.replace(/'/g, "''").replace(/;/g, '');
  },
  
  url: (input: string): string => {
    return encodeURIComponent(input);
  },
  
  filename: (input: string): string => {
    return input.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
};

/**
 * Enhanced form validation with security checks
 */
export const validateSecureForm = (
  data: Record<string, any>,
  rules: Record<string, any>
): { isValid: boolean; errors: Record<string, string>; riskScore: number } => {
  const errors: Record<string, string> = {};
  let riskScore = 0;

  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = `${field} is required`;
      continue;
    }

    if (value && typeof value === 'string') {
      // Check for potential XSS
      if (/<script|javascript:|data:|vbscript:|onload|onerror/i.test(value)) {
        errors[field] = `${field} contains potentially dangerous content`;
        riskScore += 50;
      }

      // Check for potential SQL injection
      if (/(union|select|insert|update|delete|drop|exec|script|alter|create)/i.test(value)) {
        errors[field] = `${field} contains invalid characters`;
        riskScore += 40;
      }

      // Check for excessive length (potential DoS)
      if (value.length > 10000) {
        errors[field] = `${field} is too long`;
        riskScore += 20;
      }
    }

    // Standard validation
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }
  }

  return { 
    isValid: Object.keys(errors).length === 0, 
    errors, 
    riskScore: Math.min(riskScore, 100) 
  };
};

// Export instances
export const csrfManager = CSRFTokenManager.getInstance();
export const authRateLimiter = new EnhancedRateLimiter(5, 15, 30);
export const apiRateLimiter = new EnhancedRateLimiter(100, 1, 5);
