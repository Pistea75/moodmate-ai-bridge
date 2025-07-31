import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
        message = 'Password must be at least 6 characters long.';
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
      
      console.log('🔄 Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }

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
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
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
      
      console.log('🔄 About to call supabase.auth.signUp with:', {
        email: email.trim(),
        metadata: cleanedMetadata
      });
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: cleanedMetadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        console.error('❌ Supabase signup error:', error);
        throw error;
      }
      
      console.log('✅ Supabase signup successful, response data:', data);
      
      if (!data?.user) {
        throw new Error('Failed to create user account');
      }

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