
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
    
    if (error.message.includes('Email not confirmed')) {
      message = 'Please check your email and confirm your account before logging in.';
    } else if (error.message.includes('Invalid login credentials')) {
      message = 'Invalid email or password.';
    } else if (error.message.includes('User already registered')) {
      message = 'This email is already registered. Please try logging in instead.';
    } else if (error.message.includes('Password should be')) {
      message = 'Password should be at least 6 characters long.';
    } else if (error.message.includes('Database error saving new user')) {
      message = 'Error creating account. Please try again or contact support.';
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
      
      console.log('Signing up with metadata:', metadata);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        }
      });

      if (error) throw error;

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
