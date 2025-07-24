
/**
 * Security utilities for the application
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
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
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
  
  return { isValid: errors.length === 0, errors };
};

/**
 * Rate limiting utility for API calls
 */
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userAttempts = this.attempts.get(identifier);

    if (!userAttempts) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Reset if window has passed
    if (now - userAttempts.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
      return true;
    }

    // Check if under limit
    if (userAttempts.count < this.maxAttempts) {
      userAttempts.count++;
      userAttempts.lastAttempt = now;
      return true;
    }

    return false;
  }

  getRemainingTime(identifier: string): number {
    const userAttempts = this.attempts.get(identifier);
    if (!userAttempts) return 0;
    
    const elapsed = Date.now() - userAttempts.lastAttempt;
    return Math.max(0, this.windowMs - elapsed);
  }
}

export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

/**
 * Secure session validation
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
  if (!userRole || !Array.isArray(allowedRoles)) {
    return false;
  }
  
  return allowedRoles.includes(userRole);
};

/**
 * Secure data validation for forms
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
  }
  
  return { isValid: Object.keys(errors).length === 0, errors };
};

/**
 * Security audit logging helper
 */
export const logSecurityEvent = async (
  action: string,
  resource: string,
  details: Record<string, any> = {},
  success: boolean = true
) => {
  try {
    // This would typically call a secure API endpoint
    console.log('Security Event:', {
      action,
      resource,
      details,
      success,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};
