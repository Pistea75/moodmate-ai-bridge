
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
        message = 'Invalid email or password.';
      } else if (error.message?.includes('User already registered')) {
        message = 'This email is already registered. Please try logging in instead.';
      } else if (error.message?.includes('Password should be')) {
        message = 'Password should be at least 6 characters long.';
      } else if (error.message?.includes('Database error saving new user')) {
        message = 'Server error during registration. Please try again or contact support.';
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
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have successfully logged in.",
      });
      
      return true;
    } catch (error: any) {
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
      
      // Ensure all metadata values are properly formatted
      const cleanedMetadata = { ...metadata };
      
      // Only process referral_code if it exists and is not empty
      if (cleanedMetadata.referral_code && typeof cleanedMetadata.referral_code === 'string') {
        cleanedMetadata.referral_code = cleanedMetadata.referral_code.trim().toUpperCase();
        // If it's empty after trimming, set to null
        if (cleanedMetadata.referral_code === '') {
          cleanedMetadata.referral_code = null;
        }
      } else {
        // Ensure null if not provided or empty
        cleanedMetadata.referral_code = null;
      }
      
      console.log('Signing up with metadata:', cleanedMetadata);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: cleanedMetadata,
          emailRedirectTo: window.location.origin + '/login'
        }
      });

      if (error) throw error;
      
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
