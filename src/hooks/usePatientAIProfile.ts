
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIPreferences {
  tone: string;
  strategies: string;
  triggersToAvoid: string;
  motivators: string;
  dosAndDonts: string;
}

export function usePatientAIProfile(patientId: string) {
  const [preferences, setPreferences] = useState<AIPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPersonalization, setHasPersonalization] = useState(false);
  const { toast } = useToast();

  const fetchPreferences = async () => {
    if (!patientId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('ai_patient_profiles')
        .select('preferences')
        .eq('patient_id', patientId)
        .maybeSingle();

      if (error) {
        console.error('Error loading AI preferences:', error);
        toast({
          variant: 'destructive',
          title: 'Error loading AI preferences',
          description: error.message
        });
      } else if (data?.preferences) {
        setPreferences(data.preferences as AIPreferences);
        setHasPersonalization(true);
      } else {
        setHasPersonalization(false);
      }
    } catch (error) {
      console.error('Error in fetchPreferences:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [patientId]);

  const updatePreferences = async (newPreferences: AIPreferences, clinicianId?: string) => {
    try {
      const { data: existing } = await supabase
        .from('ai_patient_profiles')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      const payload = {
        patient_id: patientId,
        ...(clinicianId && { clinician_id: clinicianId }),
        preferences: newPreferences as any
      };

      const { error } = existing
        ? await supabase
            .from('ai_patient_profiles')
            .update(payload)
            .eq('patient_id', patientId)
        : await supabase
            .from('ai_patient_profiles')
            .insert([payload]);

      if (error) {
        throw error;
      }

      setPreferences(newPreferences);
      setHasPersonalization(true);
      
      toast({ 
        title: 'Success',
        description: 'AI preferences updated successfully!' 
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error updating preferences',
        description: error instanceof Error ? error.message : 'Failed to update preferences'
      });
    }
  };

  return {
    preferences,
    loading,
    hasPersonalization,
    fetchPreferences,
    updatePreferences
  };
}
