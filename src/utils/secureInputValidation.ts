
/**
 * Enhanced input validation and sanitization utilities
 */

import { sanitizeForContext } from './enhancedSecurityUtils';

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
  sanitizedData: Record<string, any>;
}

export const validateAndSanitizeForm = (
  data: Record<string, any>,
  rules: Record<string, ValidationRule>
): ValidationResult => {
  const errors: Record<string, string[]> = {};
  const sanitizedData: Record<string, any> = {};

  for (const [field, value] of Object.entries(data)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;

    const fieldErrors: string[] = [];
    let sanitizedValue = value;

    // Sanitize the input first
    if (typeof value === 'string') {
      sanitizedValue = sanitizeForContext.html(value);
    }

    // Required validation
    if (fieldRules.required && (!sanitizedValue || String(sanitizedValue).trim() === '')) {
      fieldErrors.push(`${field} is required`);
    }

    // Length validation
    if (sanitizedValue && fieldRules.minLength && String(sanitizedValue).length < fieldRules.minLength) {
      fieldErrors.push(`${field} must be at least ${fieldRules.minLength} characters`);
    }

    if (sanitizedValue && fieldRules.maxLength && String(sanitizedValue).length > fieldRules.maxLength) {
      fieldErrors.push(`${field} must be no more than ${fieldRules.maxLength} characters`);
    }

    // Pattern validation
    if (sanitizedValue && fieldRules.pattern && !fieldRules.pattern.test(String(sanitizedValue))) {
      fieldErrors.push(`${field} format is invalid`);
    }

    // Custom validation
    if (sanitizedValue && fieldRules.custom) {
      const customError = fieldRules.custom(sanitizedValue);
      if (customError) {
        fieldErrors.push(customError);
      }
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }

    sanitizedData[field] = sanitizedValue;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData
  };
};

// Email validation with additional security checks
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const sanitizedEmail = sanitizeForContext.html(email).toLowerCase();
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitizedEmail)) {
    return { isValid: false, error: 'Invalid email format' };
  }

  // Length check
  if (sanitizedEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /\+.*\+/, // Multiple + signs
    /\.{2,}/, // Multiple consecutive dots
    /@.*@/, // Multiple @ signs
    /[<>]/, // HTML brackets
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(sanitizedEmail)) {
      return { isValid: false, error: 'Email contains invalid characters' };
    }
  }

  return { isValid: true };
};

// Phone number validation
export const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
  const sanitizedPhone = sanitizeForContext.html(phone);
  
  // Allow common phone formats
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  const cleanPhone = sanitizedPhone.replace(/[\s\-\(\)]/g, '');
  
  if (!phoneRegex.test(cleanPhone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }

  if (cleanPhone.length < 10 || cleanPhone.length > 16) {
    return { isValid: false, error: 'Phone number must be between 10-16 digits' };
  }

  return { isValid: true };
};

// URL validation with security checks
export const validateUrl = (url: string): { isValid: boolean; error?: string } => {
  const sanitizedUrl = sanitizeForContext.url(url);
  
  try {
    const urlObj = new URL(sanitizedUrl);
    
    // Only allow HTTP/HTTPS protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS URLs are allowed' };
    }

    // Check for suspicious patterns
    if (urlObj.hostname.includes('localhost') || urlObj.hostname.includes('127.0.0.1')) {
      return { isValid: false, error: 'Local URLs are not allowed' };
    }

    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

// Common validation rules
export const commonValidationRules = {
  email: {
    required: true,
    maxLength: 254,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      const result = validateEmail(value);
      return result.isValid ? null : result.error || 'Invalid email';
    }
  },
  password: {
    required: true,
    minLength: 12,
    maxLength: 128,
    custom: (value: string) => {
      const result = validatePasswordStrength(value);
      return result.isValid ? null : result.errors.join(', ');
    }
  },
  firstName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    custom: (value: string) => {
      if (value.trim().length === 0) return 'First name cannot be empty';
      return null;
    }
  },
  lastName: {
    required: true,
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-']+$/,
    custom: (value: string) => {
      if (value.trim().length === 0) return 'Last name cannot be empty';
      return null;
    }
  },
  phone: {
    required: false,
    minLength: 10,
    maxLength: 20,
    custom: (value: string) => {
      if (!value) return null;
      const result = validatePhone(value);
      return result.isValid ? null : result.error || 'Invalid phone number';
    }
  }
};

// Import password validation from the new file
import { validatePasswordStrength } from './passwordValidation';
