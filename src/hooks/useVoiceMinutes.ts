import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VoiceMinutesData {
  canUse: boolean;
  minutesRemaining: number;
  minutesLimit: number;
  minutesUsed: number;
  reason: string;
  planType: string;
  isUnlimited: boolean;
}

export function useVoiceMinutes() {
  const { user } = useAuth();
  const [voiceData, setVoiceData] = useState<VoiceMinutesData>({
    canUse: false,
    minutesRemaining: 0,
    minutesLimit: 0,
    minutesUsed: 0,
    reason: 'Loading...',
    planType: 'free',
    isUnlimited: false
  });
  const [loading, setLoading] = useState(true);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const checkVoiceAccess = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('can_use_voice_mode', {
        user_uuid: user.id
      });

      if (error) throw error;

      const result = data as any;
      const isUnlimited = result.minutes_remaining === -1;
      
      setVoiceData({
        canUse: result.can_use || false,
        minutesRemaining: isUnlimited ? -1 : (result.minutes_remaining || 0),
        minutesLimit: result.minutes_limit || 0,
        minutesUsed: result.minutes_used || 0,
        reason: result.reason || '',
        planType: result.plan_type || 'free',
        isUnlimited
      });
    } catch (error) {
      console.error('Error checking voice access:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const startVoiceSession = useCallback(async () => {
    if (!user) return null;

    try {
      // Create voice usage log entry
      const { data, error } = await (supabase as any)
        .from('voice_usage_logs')
        .insert([{
          user_id: user.id,
          session_start: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setSessionStartTime(new Date());
      setActiveSessionId(data.id);
      return data.id;
    } catch (error) {
      console.error('Error starting voice session:', error);
      return null;
    }
  }, [user]);

  const endVoiceSession = useCallback(async () => {
    if (!user || !sessionStartTime || !activeSessionId) return;

    try {
      const endTime = new Date();
      const durationSeconds = (endTime.getTime() - sessionStartTime.getTime()) / 1000;

      // Update voice usage log
      await (supabase as any)
        .from('voice_usage_logs')
        .update({
          session_end: endTime.toISOString(),
          duration_seconds: durationSeconds
        })
        .eq('id', activeSessionId);

      // Track usage in subscribers table
      await supabase.rpc('track_voice_usage', {
        user_uuid: user.id,
        duration_seconds: durationSeconds
      });

      // Refresh voice data
      await checkVoiceAccess();

      setSessionStartTime(null);
      setActiveSessionId(null);
    } catch (error) {
      console.error('Error ending voice session:', error);
    }
  }, [user, sessionStartTime, activeSessionId, checkVoiceAccess]);

  const updatePrivacySettings = useCallback(async (
    anonymizeConversations: boolean
  ) => {
    if (!user) return;

    try {
      // Update settings
      await supabase
        .from('subscribers')
        .update({
          anonymize_conversations: anonymizeConversations
        })
        .eq('user_id', user.id);

      // Log consent change
      await supabase
        .from('privacy_consent_logs')
        .insert({
          user_id: user.id,
          consent_type: 'anonymize_conversations',
          consent_given: anonymizeConversations
        });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
    }
  }, [user]);

  useEffect(() => {
    checkVoiceAccess();
  }, [checkVoiceAccess]);

  return {
    voiceData,
    loading,
    checkVoiceAccess,
    startVoiceSession,
    endVoiceSession,
    updatePrivacySettings,
    sessionStartTime
  };
}
