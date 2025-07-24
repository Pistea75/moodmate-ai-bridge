
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { validateSession } from '@/utils/securityUtils';
import { toast } from '@/hooks/use-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSecureApi<T = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const makeSecureRequest = useCallback(async <R = T>(
    requestFn: () => Promise<{ data: R | null; error: any }>,
    options?: {
      requireAuth?: boolean;
      onSuccess?: (data: R) => void;
      onError?: (error: any) => void;
      showErrorToast?: boolean;
    }
  ): Promise<R | null> => {
    const {
      requireAuth = true,
      onSuccess,
      onError,
      showErrorToast = true,
    } = options || {};

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Check authentication if required
      if (requireAuth) {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session || !validateSession(session)) {
          const error = 'Authentication required. Please sign in again.';
          setState(prev => ({ ...prev, loading: false, error }));
          
          if (showErrorToast) {
            toast({
              title: "Authentication Error",
              description: error,
              variant: "destructive",
            });
          }
          
          return null;
        }
      }

      // Make the request
      const { data, error } = await requestFn();

      if (error) {
        const errorMessage = error.message || 'An unexpected error occurred';
        setState(prev => ({ ...prev, loading: false, error: errorMessage }));
        
        if (showErrorToast) {
          toast({
            title: "Request Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
        
        onError?.(error);
        return null;
      }

      setState(prev => ({ ...prev, loading: false, data: data as T }));
      onSuccess?.(data as R);
      return data as R;

    } catch (error: any) {
      const errorMessage = error.message || 'Network error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      
      if (showErrorToast) {
        toast({
          title: "Network Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      onError?.(error);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const resetState = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    makeSecureRequest,
    clearError,
    resetState,
  };
}
