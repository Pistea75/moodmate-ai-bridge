
/**
 * Enhanced password validation with stricter requirements
 */

export interface PasswordStrengthResult {
  isValid: boolean;
  score: number;
  errors: string[];
  suggestions: string[];
}

export const validatePasswordStrength = (password: string): PasswordStrengthResult => {
  const errors: string[] = [];
  const suggestions: string[] = [];
  let score = 0;

  if (!password) {
    errors.push('Password is required');
    return { isValid: false, score: 0, errors, suggestions };
  }

  // Minimum length requirement (increased to 12)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
    suggestions.push('Add more characters to reach minimum length');
  } else {
    score += 20;
  }

  // Character type requirements
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
    suggestions.push('Add uppercase letters (A-Z)');
  } else {
    score += 15;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
    suggestions.push('Add lowercase letters (a-z)');
  } else {
    score += 15;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
    suggestions.push('Add numbers (0-9)');
  } else {
    score += 15;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
    suggestions.push('Add special characters (!@#$%^&*(),.?":{}|<>)');
  } else {
    score += 15;
  }

  // Additional security checks
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
    suggestions.push('Avoid repeating the same character multiple times');
  } else {
    score += 5;
  }

  // Check for common weak patterns
  const commonPatterns = [
    'password', 'Password', 'PASSWORD',
    '123456', '12345678', '123456789',
    'qwerty', 'QWERTY', 'qwertyuiop',
    'admin', 'Admin', 'ADMIN',
    'welcome', 'Welcome', 'WELCOME',
    'letmein', 'monkey', 'dragon',
    'football', 'baseball', 'basketball'
  ];

  const hasCommonPattern = commonPatterns.some(pattern => 
    password.toLowerCase().includes(pattern.toLowerCase())
  );

  if (hasCommonPattern) {
    errors.push('Password cannot contain common words or patterns');
    suggestions.push('Use unique combinations instead of common words');
  } else {
    score += 10;
  }

  // Bonus points for longer passwords
  if (password.length >= 16) {
    score += 5;
  }

  // Check for dictionary words (basic check)
  const dictionaryWords = ['love', 'hate', 'life', 'death', 'good', 'evil', 'light', 'dark'];
  const hasDictionaryWord = dictionaryWords.some(word => 
    password.toLowerCase().includes(word)
  );

  if (hasDictionaryWord) {
    suggestions.push('Consider avoiding common dictionary words');
    score -= 5;
  }

  const isValid = errors.length === 0;
  const finalScore = Math.max(0, Math.min(100, score));

  return {
    isValid,
    score: finalScore,
    errors,
    suggestions
  };
};

export const getPasswordStrengthLevel = (score: number): 'weak' | 'fair' | 'good' | 'strong' => {
  if (score < 30) return 'weak';
  if (score < 50) return 'fair';
  if (score < 80) return 'good';
  return 'strong';
};

export const getPasswordStrengthColor = (score: number): string => {
  if (score < 30) return 'text-red-500';
  if (score < 50) return 'text-orange-500';
  if (score < 80) return 'text-yellow-500';
  return 'text-green-500';
};
