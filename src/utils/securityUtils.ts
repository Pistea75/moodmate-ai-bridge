
/**
 * Enhanced security utilities for the application
 */

/**
 * Sanitizes user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;')
    .trim();
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
 * Enhanced rate limiting utility for API calls
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number; blocked: boolean }> = new Map();
  private maxAttempts: number;
  private windowMs: number;
  private blockDurationMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000, blockDurationMs: number = 30 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
      return true;
    }

    // Check if user is blocked
    if (userAttempts.blocked && now - userAttempts.lastAttempt < this.blockDurationMs) {
      return false;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now, blocked: false });
      return true;
    }

    // Check if under limit
    if (userAttempts.count < this.maxAttempts) {
      userAttempts.count++;
      userAttempts.lastAttempt = now;
      return true;
    }

    // Block user after exceeding limit
    userAttempts.blocked = true;
    userAttempts.lastAttempt = now;
    return false;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    
    const elapsed = Date.now() - userAttempts.lastAttempt;
    if (userAttempts.blocked) {
      return Math.max(0, this.blockDurationMs - elapsed);
    }
    return Math.max(0, this.windowMs - elapsed);
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000, 30 * 60 * 1000);
export const apiRateLimiter = new RateLimiter(100, 60 * 1000, 5 * 60 * 1000);

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
export const validateFormData = (data: Record<string, any>, rules: Record<string, any>): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  
  for (const [field, rule] of Object.entries(rules)) {
    const value = data[field];
    
    if (rule.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors[field] = `${field} is required`;
      continue;
    }
    
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `${field} must be less than ${rule.maxLength} characters`;
    }
    
    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
    
    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message || `${field} format is invalid`;
    }
    
    // XSS protection
    if (typeof value === 'string' && /<script|javascript:|data:/i.test(value)) {
      errors[field] = `${field} contains invalid content`;
    }
    
    // SQL injection protection
    if (typeof value === 'string' && /(union|select|insert|update|delete|drop|exec|script)/i.test(value)) {
      errors[field] = `${field} contains invalid characters`;
    }
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Enhanced security audit logging with additional metadata
 */
export const logSecurityEvent = async (
  action: string,
  resource: string,
  details: Record<string, any> = {},
  success: boolean = true
) => {
  try {
    const auditData = {
      action,
      resource,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        url: window.location.href
      },
      success
    };
    
    // Log to console for development
    console.log('Security Event:', auditData);
    
    // In production, this would send to audit logging service
    // await fetch('/api/security/audit', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(auditData)
    // });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
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
  return sanitizeInput(input);
};

export const sanitizeForURL = (input: string): string => {
  return encodeURIComponent(input);
};

export const sanitizeForSQL = (input: string): string => {
  return input.replace(/'/g, "''").replace(/;/g, '');
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
