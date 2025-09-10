// Shared security utilities for Edge Functions
export interface SecurityConfig {
  maxStringLength: number;
  maxPayloadSize: number;
  rateLimitDefault: string;
  rateLimitInvite: string;
}

export const SECURITY_CONFIG: SecurityConfig = {
  maxStringLength: 256,
  maxPayloadSize: 10 * 1024 * 1024, // 10MB
  rateLimitDefault: '100/m',
  rateLimitInvite: '10/m'
};

// Input validation utilities
export function validateEmail(email: string): boolean {
  if (!email || email.length > SECURITY_CONFIG.maxStringLength) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  if (!phone || phone.length > 20) return false;
  // E.164 format validation
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function validateName(name: string): boolean {
  if (!name || name.length > 100 || name.length < 1) return false;
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  return nameRegex.test(name.trim());
}

export function validateInvitationCode(code: string): boolean {
  if (!code || code.length !== 8) return false;
  // Alphanumeric only
  const codeRegex = /^[A-Za-z0-9]{8}$/;
  return codeRegex.test(code);
}

// Sanitization utilities
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function sanitizeForSql(input: string): string {
  // Remove potential SQL injection patterns
  return input
    .replace(/[';--]/g, '')
    .replace(/\b(union|select|insert|update|delete|drop|create|alter)\b/gi, '')
    .trim();
}

// Rate limiting utilities
export interface RateLimit {
  key: string;
  limit: number;
  window: number; // seconds
}

export async function checkRateLimit(
  supabase: any,
  ipAddress: string,
  actionType: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
  const windowStart = new Date(Date.now() - windowSeconds * 1000);
  
  // Check current attempts
  const { data: existing } = await supabase
    .from('invitation_rate_limits')
    .select('attempts, blocked_until')
    .eq('ip_address', ipAddress)
    .gte('window_start', windowStart.toISOString())
    .single();

  // Check if blocked
  if (existing?.blocked_until && new Date(existing.blocked_until) > new Date()) {
    return { allowed: false, remaining: 0 };
  }

  const currentAttempts = existing?.attempts || 0;
  
  if (currentAttempts >= limit) {
    // Block for 1 hour
    const blockedUntil = new Date(Date.now() + 60 * 60 * 1000);
    
    await supabase
      .from('invitation_rate_limits')
      .upsert({
        ip_address: ipAddress,
        attempts: currentAttempts + 1,
        blocked_until: blockedUntil.toISOString(),
        window_start: new Date().toISOString()
      });
    
    return { allowed: false, remaining: 0 };
  }

  // Increment attempts
  await supabase
    .from('invitation_rate_limits')
    .upsert({
      ip_address: ipAddress,
      attempts: currentAttempts + 1,
      window_start: existing ? undefined : new Date().toISOString()
    });

  return { allowed: true, remaining: limit - currentAttempts - 1 };
}

// Security headers
export function getSecurityHeaders(isDevelopment: boolean = false): Record<string, string> {
  const nonce = generateNonce();
  
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': `default-src 'self'; connect-src 'self' https://*.supabase.co https://api.openai.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-${nonce}'`
  };

  // Add HSTS for production
  if (!isDevelopment) {
    headers['Strict-Transport-Security'] = 'max-age=63072000; includeSubDomains; preload';
  }

  // Don't set X-Frame-Options in development for Lovable iframe
  if (!isDevelopment) {
    headers['X-Frame-Options'] = 'DENY';
  }

  return headers;
}

export function generateNonce(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Security event logging
export async function logSecurityEvent(
  supabase: any,
  eventType: string,
  details: any,
  severity: 'info' | 'warning' | 'critical' = 'info',
  userId?: string,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await supabase
      .from('security_events_log')
      .insert({
        event_type: eventType,
        user_id: userId,
        ip_address: ipAddress,
        user_agent: userAgent,
        details,
        severity
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
}

// Validate request payload
export function validatePayload(payload: any, requiredFields: string[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check required fields
  for (const field of requiredFields) {
    if (!payload[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Check payload size
  const payloadSize = JSON.stringify(payload).length;
  if (payloadSize > SECURITY_CONFIG.maxPayloadSize) {
    errors.push(`Payload too large: ${payloadSize} bytes`);
  }

  return { valid: errors.length === 0, errors };
}