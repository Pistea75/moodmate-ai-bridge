import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

export interface BrodiInteraction {
  id: string;
  user_id: string;
  interaction_type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
  message: string;
  user_response?: 'dismissed' | 'engaged' | 'completed_action' | 'ignored';
  context_data?: Record<string, any>;
  effectiveness_score?: number;
  created_at: string;
  responded_at?: string;
}

export interface BrodiPreferences {
  id?: string;
  user_id: string;
  frequency_preference: 'minimal' | 'normal' | 'frequent';
  interaction_style: 'professional' | 'friendly' | 'casual';
  nudge_enabled: boolean;
  celebration_enabled: boolean;
  mood_reminders_enabled: boolean;
  task_reminders_enabled: boolean;
  quiet_hours_start?: string;
  quiet_hours_end?: string;
  created_at?: string;
  updated_at?: string;
}

export function useBrodiInteractions() {
  const { user } = useAuth();
  const [interactions, setInteractions] = useState<BrodiInteraction[]>([]);
  const [preferences, setPreferences] = useState<BrodiPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user preferences
  useEffect(() => {
    if (!user) return;

    const loadPreferences = async () => {
      try {
        const { data, error } = await supabase
          .from('brodi_user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading Brodi preferences:', error);
          return;
        }

        if (data) {
          setPreferences({
            ...data,
            frequency_preference: data.frequency_preference as 'minimal' | 'normal' | 'frequent',
            interaction_style: data.interaction_style as 'professional' | 'friendly' | 'casual',
          });
        } else {
          // Create default preferences
          const defaultPrefs = {
            user_id: user.id,
            frequency_preference: 'normal' as const,
            interaction_style: 'friendly' as const,
            nudge_enabled: true,
            celebration_enabled: true,
            mood_reminders_enabled: true,
            task_reminders_enabled: true,
          };

          const { data: newPrefs, error: createError } = await supabase
            .from('brodi_user_preferences')
            .insert([defaultPrefs])
            .select()
            .single();

          if (createError) {
            console.error('Error creating default preferences:', createError);
          } else if (newPrefs) {
            setPreferences({
              ...newPrefs,
              frequency_preference: newPrefs.frequency_preference as 'minimal' | 'normal' | 'frequent',
              interaction_style: newPrefs.interaction_style as 'professional' | 'friendly' | 'casual',
            });
          }
        }
      } catch (error) {
        console.error('Error in loadPreferences:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  // Record a new interaction
  const recordInteraction = async (
    type: BrodiInteraction['interaction_type'],
    message: string,
    contextData?: Record<string, any>
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('brodi_interactions')
        .insert([{
          user_id: user.id,
          interaction_type: type,
          message,
          context_data: contextData || {},
        }])
        .select()
        .single();

      if (error) {
        console.error('Error recording interaction:', error);
        return null;
      }

      setInteractions(prev => [{
        id: data.id,
        user_id: data.user_id,
        interaction_type: data.interaction_type as BrodiInteraction['interaction_type'],
        message: data.message,
        user_response: data.user_response as BrodiInteraction['user_response'],
        context_data: data.context_data as Record<string, any>,
        effectiveness_score: data.effectiveness_score || undefined,
        created_at: data.created_at,
        responded_at: data.responded_at || undefined,
      }, ...prev]);
      return data.id;
    } catch (error) {
      console.error('Error in recordInteraction:', error);
      return null;
    }
  };

  // Update interaction with user response
  const updateInteractionResponse = async (
    interactionId: string,
    response: BrodiInteraction['user_response'],
    effectivenessScore?: number
  ) => {
    try {
      const { error } = await supabase
        .from('brodi_interactions')
        .update({
          user_response: response,
          effectiveness_score: effectivenessScore,
          responded_at: new Date().toISOString(),
        })
        .eq('id', interactionId);

      if (error) {
        console.error('Error updating interaction:', error);
        return;
      }

      setInteractions(prev => 
        prev.map(interaction => 
          interaction.id === interactionId
            ? { ...interaction, user_response: response, effectiveness_score: effectivenessScore }
            : interaction
        )
      );
    } catch (error) {
      console.error('Error in updateInteractionResponse:', error);
    }
  };

  // Update user preferences
  const updatePreferences = async (updates: Partial<BrodiPreferences>) => {
    if (!user || !preferences) return;

    try {
      const { data, error } = await supabase
        .from('brodi_user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating preferences:', error);
        toast({
          title: "Error",
          description: "Failed to update Brodi preferences",
          variant: "destructive",
        });
        return;
      }

      setPreferences({
        ...data,
        frequency_preference: data.frequency_preference as 'minimal' | 'normal' | 'frequent',
        interaction_style: data.interaction_style as 'professional' | 'friendly' | 'casual',
      });
      toast({
        title: "Settings Updated",
        description: "Brodi preferences have been saved",
      });
    } catch (error) {
      console.error('Error in updatePreferences:', error);
    }
  };

  // Check if Brodi should appear based on preferences and timing
  const shouldShowBrodi = (type: BrodiInteraction['interaction_type']): boolean => {
    if (!preferences) return false;

    // Check if the interaction type is enabled
    switch (type) {
      case 'nudge':
        return preferences.nudge_enabled;
      case 'celebration':
        return preferences.celebration_enabled;
      case 'mood_reminder':
        return preferences.mood_reminders_enabled;
      case 'task_reminder':
        return preferences.task_reminders_enabled;
      default:
        return true;
    }
  };

  return {
    interactions,
    preferences,
    loading,
    recordInteraction,
    updateInteractionResponse,
    updatePreferences,
    shouldShowBrodi,
  };
}