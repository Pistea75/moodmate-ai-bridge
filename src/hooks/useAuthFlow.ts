
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

  const handleAuthError = (error: any) => {
    console.error('Auth error:', error);
    let message = 'An unexpected error occurred';
    
    if (typeof error === 'object') {
      // Handle different error messages for better user feedback
      if (error.message?.includes('Email not confirmed')) {
        message = 'Please check your email and confirm your account before logging in.';
      } else if (error.message?.includes('Invalid login credentials')) {
        message = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message?.includes('User already registered')) {
        message = 'This email is already registered. Please try logging in instead.';
      } else if (error.message?.includes('Password should be')) {
        message = 'Password should be at least 6 characters long.';
      } else if (error.message?.includes('Database error saving new user') || 
                error.message?.includes('Database error') ||
                error.message?.includes('error in Supabase function')) {
        message = 'There was a technical issue during registration. Please try again with a different email or contact support.';
      } else if (error.message?.includes('Network error') || 
                error.message?.includes('fetch')) {
        message = 'Network connection issue. Please check your internet connection and try again.';
      } else if (error.message?.includes('Too many requests')) {
        message = 'Too many login attempts. Please wait a few minutes before trying again.';
      } else if (error.message?.includes('Unable to validate email address')) {
        message = 'Please enter a valid email address.';
      } else if (error.message?.includes('row-level security policy')) {
        message = 'Account setup incomplete. Please contact support if this issue persists.';
      } else if (error.message) {
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
      
      // Basic validation
      if (!email || !password) {
        throw new Error('Please enter both email and password.');
      }
      
      if (!email.includes('@')) {
        throw new Error('Please enter a valid email address.');
      }
      
      console.log('Starting sign in process...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;
      
      if (!data.user) {
        throw new Error('Login failed. Please try again.');
      }

      console.log('Sign in successful');
      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Sign in error:', error);
      handleAuthError(error);
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
        throw new Error('Please enter both email and password.');
      }
      
      if (password.length < 6) {
        throw new Error('Password should be at least 6 characters long.');
      }
      
      // Create a new cleaned metadata object rather than modifying the original
      const cleanedMetadata = { ...metadata };
      
      // Ensure role is always set with default fallback
      if (!cleanedMetadata.role) {
        cleanedMetadata.role = 'patient';
      }
      
      // Process referral code if it exists
      if (cleanedMetadata.referral_code) {
        if (typeof cleanedMetadata.referral_code === 'string' && cleanedMetadata.referral_code.trim() !== '') {
          cleanedMetadata.referral_code = cleanedMetadata.referral_code.trim().toUpperCase();
        } else {
          // Remove invalid referral code
          delete cleanedMetadata.referral_code;
        }
      }
      
      console.log('Signing up with metadata:', cleanedMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: cleanedMetadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) throw error;
      
      console.log('Signup response data:', data);
      
      // Check if we got user data back
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
      handleAuthError(error);
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
