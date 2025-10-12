
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Message, ConversationMessage } from "./types";

export function useChatHistory(patientId?: string, isClinicianView: boolean = false) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) {
        setIsFetchingHistory(false);
        return;
      }

      try {
        setIsFetchingHistory(true);
        
        // IMPORTANT: Determine the correct chat owner
        // - If clinician view: use the clinician's own ID (their personal training chat)
        // - If patient view: use patientId if provided, otherwise user.id
        const chatOwnerId = isClinicianView ? user.id : (patientId || user.id);
        
        const { data, error } = await supabase
          .from('ai_chat_logs')
          .select('*')
          .eq('patient_id', chatOwnerId)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            type: msg.role === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
            content: msg.message,
            timestamp: new Date(msg.created_at)
          }));
          
          setMessages(formattedMessages);
          
          const historyForAI = data.map(msg => ({
            role: msg.role,
            content: msg.message
          }));
          
          setConversationHistory(historyForAI);
        }
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast({
          title: "Error",
          description: "Failed to load your chat history",
          variant: "destructive"
        });
      } finally {
        setIsFetchingHistory(false);
      }
    };
    
    fetchChatHistory();
  }, [user, toast, patientId, isClinicianView]);

  return {
    messages,
    setMessages,
    isFetchingHistory,
    conversationHistory,
    setConversationHistory
  };
}
