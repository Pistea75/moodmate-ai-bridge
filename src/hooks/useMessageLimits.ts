import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface MessageLimitData {
  canSendMessage: boolean;
  messagesUsed: number;
  dailyLimit: number;
  planType: string;
  isUnlimited: boolean;
}

export function useMessageLimits() {
  const { user } = useAuth();
  const [messageData, setMessageData] = useState<MessageLimitData>({
    canSendMessage: true,
    messagesUsed: 0,
    dailyLimit: 3,
    planType: 'free',
    isUnlimited: false
  });
  const [loading, setLoading] = useState(true);

  const checkMessageLimit = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase.rpc('can_send_message', {
        user_uuid: user.id
      });

      if (error) throw error;
      
      // Fetch updated subscription data
      await fetchMessageData();
      
      return data || false;
    } catch (error) {
      console.error('Error checking message limit:', error);
      return false;
    }
  };

  const fetchMessageData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subscribers')
        .select('plan_type, message_limit_daily, messages_used_today')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      const planType = data?.plan_type || 'free';
      const dailyLimit = data?.message_limit_daily || 3;
      const messagesUsed = data?.messages_used_today || 0;
      const isUnlimited = planType === 'personal' || dailyLimit === -1;

      setMessageData({
        canSendMessage: isUnlimited || messagesUsed < dailyLimit,
        messagesUsed,
        dailyLimit: isUnlimited ? -1 : dailyLimit,
        planType,
        isUnlimited
      });
    } catch (error) {
      console.error('Error fetching message data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessageData();
  }, [user]);

  return {
    messageData,
    loading,
    checkMessageLimit,
    refreshMessageData: fetchMessageData
  };
}