
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validatePassword, authRateLimiter, logSecurityEvent, sanitizeInput, isValidEmail } from '@/utils/securityUtils';

interface AuthError {
  message: string;
  status?: number;
}

export function useAuthFlow() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const handleAuthError = async (error: any, context: string) => {
    console.error('🔴 Auth error:', error);
    let message = 'An unexpected error occurred';
    
    if (typeof error === 'object' && error.message) {
      if (error.message.includes('Email not confirmed')) {
        message = 'Please check your email and confirm your account before logging in.';
      } else if (error.message.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('User already registered')) {
        message = 'This email is already registered. Please try logging in instead.';
      } else if (error.message.includes('Password should be')) {
        message = 'Password must be at least 12 characters with uppercase, lowercase, number, and special character.';
      } else if (error.message.includes('Database error') || 
                error.message.includes('error in Supabase function')) {
        message = 'There was a technical issue. Please try again or contact support.';
      } else if (error.message.includes('Network error') || 
                error.message.includes('fetch')) {
        message = 'Network connection issue. Please check your internet connection and try again.';
      } else if (error.message.includes('Too many requests')) {
        message = 'Too many login attempts. Please wait a few minutes before trying again.';
      } else if (error.message.includes('Unable to validate email address')) {
        message = 'Please enter a valid email address.';
      } else {
        message = error.message;
      }
    }

    setError({ message });
    
    // Log security event for failed authentication
    await logSecurityEvent('auth_failure', context, { 
      error: message,
      timestamp: new Date().toISOString()
    }, false);

    toast({
      title: "Authentication Error",
      description: message,
      variant: "destructive",
    });
  };

  const clearError = () => setError(null);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      clearError();
      
      // Input validation and sanitization
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      if (!sanitizedEmail || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address.');
      }

      // Enhanced rate limiting
      const clientId = `${sanitizedEmail}_${Date.now()}`;
      if (!authRateLimiter.isAllowed(clientId)) {
        const remainingTime = Math.ceil(authRateLimiter.getRemainingTime(clientId) / 1000 / 60);
        throw new Error(`Too many login attempts. Please wait ${remainingTime} minutes before trying again.`);
      }
      
      console.log('🔄 Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Log successful authentication
      await logSecurityEvent('auth_success', 'authentication', { 
        user_id: data.user.id,
        email: data.user.email
      });

      console.log('✅ Sign in successful - auth state change will handle redirect');
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
      console.error('🔴 Sign in error:', error);
      await handleAuthError(error, 'signin');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      clearError();
      
      // Input validation and sanitization
      const sanitizedEmail = sanitizeInput(email).toLowerCase();
      
      if (!sanitizedEmail || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      if (!isValidEmail(sanitizedEmail)) {
        throw new Error('Please enter a valid email address.');
      }
      
      // Enhanced password validation
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.errors.join('. '));
      }
      
      // Sanitize metadata
      const cleanedMetadata = metadata ? Object.keys(metadata).reduce((acc, key) => {
        const value = metadata[key];
        if (typeof value === 'string') {
          acc[key] = sanitizeInput(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any) : {};
      
      if (!cleanedMetadata.role) {
        cleanedMetadata.role = 'patient';
      }
      
      if (cleanedMetadata.referral_code) {
        if (typeof cleanedMetadata.referral_code === 'string' && cleanedMetadata.referral_code.trim() !== '') {
          cleanedMetadata.referral_code = cleanedMetadata.referral_code.trim().toUpperCase();
        } else {
          delete cleanedMetadata.referral_code;
        }
      }
      
      console.log('Signing up with metadata:', cleanedMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          data: cleanedMetadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) throw error;
      
      console.log('Signup response data:', data);
      
      if (!data?.user) {
        throw new Error('Failed to create user account');
      }

      // Log successful signup
      await logSecurityEvent('signup_success', 'authentication', { 
        user_id: data.user.id,
        email: data.user.email,
        role: cleanedMetadata.role
      });

      toast({
        title: "Success",
        description: "Please check your email to confirm your account.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Full signup error:', error);
      await handleAuthError(error, 'signup');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    signIn,
    signUp,
    clearError,
  };
}
