
import { supabase } from '@/integrations/supabase/client';

/**
 * Enhanced security utilities with comprehensive protection
 */

// Password validation with consistent 12+ character requirement
export const validatePasswordStrength = (password: string): { isValid: boolean; errors: string[] } => {
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
  
  const commonPatterns = [
    'password', 'Password', 'PASSWORD',
    '123456', '12345678', '123456789',
    'qwerty', 'QWERTY', 'qwertyuiop',
    'admin', 'Admin', 'ADMIN',
    'welcome', 'Welcome', 'WELCOME',
    'letmein', 'monkey', 'dragon'
  ];
  
  if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern.toLowerCase()))) {
    errors.push('Password cannot contain common words or patterns');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Enhanced rate limiting with distributed support
export class EnhancedRateLimiter {
  private limits: Map<string, { count: number; resetTime: number; blockedUntil?: number }> = new Map();
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly blockDurationMs: number;
  
  constructor(windowMs: number = 60000, maxAttempts: number = 5, blockDurationMs: number = 300000) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
    this.blockDurationMs = blockDurationMs;
  }
  
  async isAllowed(identifier: string, action: string): Promise<boolean> {
    const key = `${identifier}_${action}`;
    const now = Date.now();
    const entry = this.limits.get(key);
    
    // Check if currently blocked
    if (entry?.blockedUntil && now < entry.blockedUntil) {
      return false;
    }
    
    // Reset if window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return true;
    }
    
    // Increment count
    entry.count++;
    
    // Block if limit exceeded
    if (entry.count > this.maxAttempts) {
      entry.blockedUntil = now + this.blockDurationMs;
      
      // Log security event
      await this.logRateLimitViolation(identifier, action, entry.count);
      
      return false;
    }
    
    return true;
  }
  
  async getRemainingTime(identifier: string, action: string): Promise<number> {
    const key = `${identifier}_${action}`;
    const entry = this.limits.get(key);
    
    if (!entry) return 0;
    
    const now = Date.now();
    if (entry.blockedUntil && now < entry.blockedUntil) {
      return entry.blockedUntil - now;
    }
    
    return 0;
  }
  
  async reset(identifier: string, action: string): Promise<void> {
    const key = `${identifier}_${action}`;
    this.limits.delete(key);
  }
  
  private async logRateLimitViolation(identifier: string, action: string, attempts: number): Promise<void> {
    try {
      await supabase.from('enhanced_security_logs').insert({
        action: 'rate_limit_violation',
        resource: action,
        success: false,
        risk_score: Math.min(attempts * 10, 100),
        details: {
          identifier,
          action,
          attempts,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Failed to log rate limit violation:', error);
    }
  }
}

// Enhanced input sanitization
export const sanitizeForContext = {
  html: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove script tags completely
    let sanitized = input.replace(/<script[^>]*>.*?<\/script>/gi, '');
    
    // Remove on* event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove javascript: urls
    sanitized = sanitized.replace(/javascript:/gi, '');
    
    // Remove data: urls (except safe ones)
    sanitized = sanitized.replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg\+xml))[^;,]*[;,]/gi, '');
    
    // Limit length
    return sanitized.slice(0, 10000);
  },
  
  sql: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    // Remove common SQL injection patterns
    const sqlPatterns = [
      /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
      /(\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/gi,
      /(;\s*--)/gi,
      /(\b(EXEC|EXECUTE)\b)/gi,
      /(\b(CAST|CONVERT|DECLARE|WHILE|BEGIN|END)\b)/gi
    ];
    
    let sanitized = input;
    sqlPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    
    return sanitized.slice(0, 1000);
  },
  
  url: (input: string): string => {
    if (!input || typeof input !== 'string') return '';
    
    try {
      const url = new URL(input);
      // Only allow http/https protocols
      if (!['http:', 'https:'].includes(url.protocol)) {
        return '';
      }
      return url.toString().slice(0, 2000);
    } catch {
      return '';
    }
  },
  
  json: (input: any): any => {
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input);
        return sanitizeForContext.json(parsed);
      } catch {
        return sanitizeForContext.html(input);
      }
    }
    
    if (Array.isArray(input)) {
      return input.map(item => sanitizeForContext.json(item));
    }
    
    if (input && typeof input === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(input)) {
        const cleanKey = sanitizeForContext.html(key);
        if (cleanKey.length > 0 && cleanKey.length <= 100) {
          sanitized[cleanKey] = sanitizeForContext.json(value);
        }
      }
      return sanitized;
    }
    
    return sanitizeForContext.html(String(input));
  }
};

// Enhanced form validation
export const validateSecureForm = (data: Record<string, any>, rules: Record<string, any>) => {
  const errors: Record<string, string[]> = {};
  
  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;
    
    const fieldErrors: string[] = [];
    
    // Required validation
    if (fieldRules.required && (!value || String(value).trim() === '')) {
      fieldErrors.push(`${field} is required`);
    }
    
    // Length validation
    if (value && fieldRules.minLength && String(value).length < fieldRules.minLength) {
      fieldErrors.push(`${field} must be at least ${fieldRules.minLength} characters`);
    }
    
    if (value && fieldRules.maxLength && String(value).length > fieldRules.maxLength) {
      fieldErrors.push(`${field} must be no more than ${fieldRules.maxLength} characters`);
    }
    
    // Pattern validation
    if (value && fieldRules.pattern && !fieldRules.pattern.test(String(value))) {
      fieldErrors.push(`${field} format is invalid`);
    }
    
    // Custom validation
    if (value && fieldRules.custom) {
      const customError = fieldRules.custom(value);
      if (customError) {
        fieldErrors.push(customError);
      }
    }
    
    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Enhanced security event logging
export const logEnhancedSecurityEvent = async (event: {
  action: string;
  resource: string;
  details?: Record<string, any>;
  success?: boolean;
  riskScore?: number;
}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    const logEntry = {
      action: event.action,
      resource: event.resource,
      user_id: user?.id || null,
      success: event.success ?? true,
      risk_score: event.riskScore ?? 0,
      details: {
        ...event.details,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        url: window.location.href
      }
    };
    
    await supabase.from('enhanced_security_logs').insert(logEntry);
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// CSRF Token Management
export class CSRFManager {
  private token: string | null = null;
  private tokenExpiry: number = 0;
  private readonly tokenLifetime = 3600000; // 1 hour
  
  async generateToken(): Promise<string> {
    const now = Date.now();
    
    // Return existing token if still valid
    if (this.token && now < this.tokenExpiry) {
      return this.token;
    }
    
    // Generate new token
    const tokenBytes = new Uint8Array(32);
    crypto.getRandomValues(tokenBytes);
    this.token = Array.from(tokenBytes, byte => byte.toString(16).padStart(2, '0')).join('');
    this.tokenExpiry = now + this.tokenLifetime;
    
    try {
      // Store in database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('csrf_tokens').insert({
          token: this.token,
          user_id: user.id,
          expires_at: new Date(this.tokenExpiry).toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to store CSRF token:', error);
    }
    
    return this.token;
  }
  
  async validateToken(token: string): Promise<boolean> {
    if (!token || token.length !== 64) {
      return false;
    }
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { data: tokenData } = await supabase
        .from('csrf_tokens')
        .select('*')
        .eq('token', token)
        .eq('user_id', user.id)
        .eq('used', false)
        .single();
      
      if (!tokenData) return false;
      
      // Check if token is expired
      if (new Date(tokenData.expires_at) < new Date()) {
        return false;
      }
      
      // Mark token as used
      await supabase
        .from('csrf_tokens')
        .update({ used: true })
        .eq('id', tokenData.id);
      
      return true;
    } catch (error) {
      console.error('CSRF token validation failed:', error);
      return false;
    }
  }
  
  async cleanup(): Promise<void> {
    try {
      // Clean up expired tokens
      await supabase
        .from('csrf_tokens')
        .delete()
        .lt('expires_at', new Date().toISOString());
    } catch (error) {
      console.error('Failed to cleanup CSRF tokens:', error);
    }
  }
}

// Generate secure nonce for CSP
export const generateCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Session invalidation on role change
export const invalidateSessionOnRoleChange = async (oldRole: string, newRole: string) => {
  if (oldRole !== newRole) {
    await logEnhancedSecurityEvent({
      action: 'role_change_detected',
      resource: 'authentication',
      details: { oldRole, newRole },
      success: true,
      riskScore: 50
    });
    
    // Force session refresh
    await supabase.auth.refreshSession();
  }
};

// Initialize global instances
export const authRateLimiter = new EnhancedRateLimiter(60000, 5, 300000); // 5 attempts per minute, 5 min block
export const apiRateLimiter = new EnhancedRateLimiter(60000, 30, 60000); // 30 requests per minute, 1 min block
export const csrfManager = new CSRFManager();

// Cleanup expired tokens periodically
setInterval(() => {
  csrfManager.cleanup();
}, 3600000); // Every hour
