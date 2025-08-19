import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useVoiceConsent() {
  const [hasConsent, setHasConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkConsent();
  }, [user]);

  const checkConsent = async () => {
    if (!user) {
      setHasConsent(false);
      setLoading(false);
      return;
    }

    try {
      // Check localStorage first for quick access
      const localConsent = localStorage.getItem('voice_consent_given');
      if (localConsent === 'true') {
        setHasConsent(true);
        setLoading(false);
        return;
      }

      // Temporarily skip database check until types are generated
      // TODO: Re-enable once Supabase types are updated
      setHasConsent(false);
    } catch (error) {
      console.error('Error checking voice consent:', error);
      setHasConsent(false);
    } finally {
      setLoading(false);
    }
  };

  const revokeConsent = async () => {
    if (!user) return;

    try {
      // Clear localStorage
      localStorage.removeItem('voice_consent_given');
      localStorage.removeItem('voice_consent_date');
      
      // Temporarily skip database update until types are generated
      // TODO: Re-enable once Supabase types are updated
      console.log('Voice consent revoked for user:', user.id);

      setHasConsent(false);
    } catch (error) {
      console.error('Error revoking consent:', error);
      throw error;
    }
  };

  return {
    hasConsent,
    loading,
    checkConsent,
    revokeConsent
  };
}