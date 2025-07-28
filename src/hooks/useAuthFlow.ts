
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { validatePasswordStrength } from '@/utils/passwordValidation';
import { validateAndSanitizeForm, commonValidationRules } from '@/utils/secureInputValidation';
import { authRateLimiter, logEnhancedSecurityEvent } from '@/utils/enhancedSecurityUtils';

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
    
    // Log security event for failed authentication with enhanced details
    await logEnhancedSecurityEvent({
      action: 'auth_failure',
      resource: context,
      details: { 
        error: message,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      success: false,
      riskScore: 25
    });

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
      
      // Enhanced input validation using new validation system
      const validation = validateAndSanitizeForm(
        { email, password },
        { 
          email: commonValidationRules.email,
          password: { required: true, minLength: 1 } // Less strict for login
        }
      );
      
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).flat().join(', ');
        throw new Error(errorMessage);
      }

      const { email: sanitizedEmail, password: sanitizedPassword } = validation.sanitizedData;

      // Enhanced rate limiting with user identification
      const clientId = `${sanitizedEmail}_signin`;
      if (!(await authRateLimiter.isAllowed(clientId, 'signin'))) {
        const remainingTime = Math.ceil((await authRateLimiter.getRemainingTime(clientId, 'signin')) / 1000 / 60);
        throw new Error(`Too many login attempts. Please wait ${remainingTime} minutes before trying again.`);
      }
      
      console.log('🔄 Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: sanitizedPassword,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }

      // Reset rate limiter on successful login
      await authRateLimiter.reset(clientId, 'signin');

      // Log successful authentication with enhanced context
      await logEnhancedSecurityEvent({
        action: 'auth_success',
        resource: 'authentication',
        details: { 
          user_id: data.user.id,
          email: data.user.email,
          loginMethod: 'password',
          timestamp: new Date().toISOString()
        },
        success: true
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
      
      // Enhanced input validation using new validation system
      const validation = validateAndSanitizeForm(
        { email, password },
        { 
          email: commonValidationRules.email,
          password: commonValidationRules.password // Strict password requirements
        }
      );
      
      if (!validation.isValid) {
        const errorMessage = Object.values(validation.errors).flat().join('. ');
        throw new Error(errorMessage);
      }

      const { email: sanitizedEmail, password: sanitizedPassword } = validation.sanitizedData;
      
      // Enhanced metadata sanitization
      const cleanedMetadata = metadata ? {
        ...metadata,
        role: metadata.role || 'patient',
        first_name: metadata.first_name ? String(metadata.first_name).trim() : '',
        last_name: metadata.last_name ? String(metadata.last_name).trim() : '',
        referral_code: metadata.referral_code ? 
          String(metadata.referral_code).trim().toUpperCase() : undefined
      } : { role: 'patient' };
      
      // Remove empty referral code
      if (cleanedMetadata.referral_code && cleanedMetadata.referral_code.trim() === '') {
        delete cleanedMetadata.referral_code;
      }
      
      console.log('Signing up with metadata:', cleanedMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password: sanitizedPassword,
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

      // Log successful signup with enhanced context
      await logEnhancedSecurityEvent({
        action: 'signup_success',
        resource: 'authentication',
        details: { 
          user_id: data.user.id,
          email: data.user.email,
          role: cleanedMetadata.role,
          hasReferralCode: !!cleanedMetadata.referral_code,
          timestamp: new Date().toISOString()
        },
        success: true
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
