import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useAnonymization() {
  const { user } = useAuth();

  const anonymizeText = useCallback(async (text: string): Promise<string> => {
    if (!user) return text;

    try {
      // Anonymization is now ALWAYS enabled for security and AI improvement
      // No need to check user settings anymore
      
      // Call anonymization edge function
      const { data, error } = await supabase.functions.invoke('anonymize-text', {
        body: { text }
      });

      if (error) {
        console.error('Error anonymizing text:', error);
        return text; // Return original on error
      }

      return data.anonymized || text;
    } catch (error) {
      console.error('Anonymization error:', error);
      return text; // Return original on error
    }
  }, [user]);

  return { anonymizeText };
}
