
import { supabase } from '@/integrations/supabase/client';
import { 
  logEnhancedSecurityEvent, 
  authRateLimiter, 
  apiRateLimiter,
  sanitizeForContext,
  validateSecureForm
} from './enhancedSecurityUtils';

/**
 * Enhanced security utilities for the application
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return sanitizeForContext.html(input).trim();
};

/**
 * Validates email format securely
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Enhanced password validation with stronger requirements
 */
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
  }
  
  if (/123456|password|qwerty|admin|welcome/i.test(password)) {
    errors.push('Password cannot contain common words or patterns');
  }
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Enhanced session validation with additional security checks
 */
export const validateSession = (session: any): boolean => {
  if (!session || !session.access_token || !session.user) {
    return false;
  }
  
  // Check if session is expired
  const expiresAt = session.expires_at;
  if (expiresAt && Date.now() / 1000 > expiresAt) {
    return false;
  }
  
  // Check token format
  if (typeof session.access_token !== 'string' || session.access_token.length < 10) {
    return false;
  }
  
  // Check user object integrity
  if (!session.user.id || !session.user.email) {
    return false;
  }
  
  return true;
};

/**
 * Generate secure random tokens
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate user roles securely using database verification
 */
export const hasValidRole = (userRole: string, allowedRoles: string[]): boolean => {
  if (!userRole || !Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return false;
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * Enhanced form data validation with security checks
 */
export const validateFormData = (data: Record<string, any>, rules: Record<string, any>) => {
  return validateSecureForm(data, rules);
};

/**
 * Enhanced security audit logging with database integration
 */
export const logSecurityEvent = async (
  action: string,
  resource: string,
  details: Record<string, any> = {},
  success: boolean = true
) => {
  // Use enhanced logging for database persistence
  await logEnhancedSecurityEvent({
    action,
    resource,
    details,
    success,
    riskScore: success ? 0 : 25
  });
};

/**
 * CSRF token generation and validation
 */
export const generateCSRFToken = (): string => {
  return generateSecureToken(32);
};

export const validateCSRFToken = (token: string, expectedToken: string): boolean => {
  return token === expectedToken && token.length === 64;
};

/**
 * Content Security Policy helper
 */
export const getCSPNonce = (): string => {
  return generateSecureToken(16);
};

/**
 * Secure cookie settings
 */
export const secureCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  maxAge: 86400 // 24 hours
};

/**
 * Input sanitization for different contexts
 */
export const sanitizeForHTML = (input: string): string => {
  return sanitizeForContext.html(input);
};

export const sanitizeForURL = (input: string): string => {
  return sanitizeForContext.url(input);
};

export const sanitizeForSQL = (input: string): string => {
  return sanitizeForContext.sql(input);
};

/**
 * Password strength meter
 */
export const getPasswordStrength = (password: string): { score: number; feedback: string[] } => {
  const feedback: string[] = [];
  let score = 0;
  
  if (password.length >= 12) score += 20;
  else feedback.push('Use at least 12 characters');
  
  if (/[a-z]/.test(password)) score += 10;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) score += 10;
  else feedback.push('Add uppercase letters');
  
  if (/\d/.test(password)) score += 10;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 10;
  else feedback.push('Add special characters');
  
  if (password.length >= 16) score += 20;
  if (!/(.)\1{2,}/.test(password)) score += 10;
  if (!/123456|password|qwerty|admin|welcome/i.test(password)) score += 10;
  
  return { score: Math.min(100, score), feedback };
};

/**
 * Session timeout management
 */
export class SessionManager {
  private timeoutId: NodeJS.Timeout | null = null;
  private readonly timeoutDuration = 30 * 60 * 1000; // 30 minutes
  private readonly warningDuration = 5 * 60 * 1000; // 5 minutes before timeout

  startTimeout(onTimeout: () => void, onWarning: () => void): void {
    this.clearTimeout();
    
    // Set warning timer
    setTimeout(() => {
      onWarning();
    }, this.timeoutDuration - this.warningDuration);
    
    // Set timeout timer
    this.timeoutId = setTimeout(() => {
      onTimeout();
    }, this.timeoutDuration);
  }

  resetTimeout(): void {
    this.clearTimeout();
  }

  clearTimeout(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}

export const sessionManager = new SessionManager();

// Re-export enhanced utilities
export { authRateLimiter, apiRateLimiter };
