
import { v4 as uuidv4 } from "uuid";
import { usePersonalization } from "./audioChat/usePersonalization";
import { useChatHistory } from "./audioChat/useChatHistory";
import { useMessageService } from "./audioChat/useMessageService";
import { useAIService } from "./audioChat/useAIService";
import { useMessageLimits } from "./useMessageLimits";
import { useAILearning } from "./useAILearning";
import { useAnonymization } from "./useAnonymization";
import { Message } from "./audioChat/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export function useAudioChat(baseSystemPrompt: string, patientId?: string, isClinicianView: boolean = false) {
  const { user } = useAuth();
  const personalizedSystemPrompt = usePersonalization(baseSystemPrompt, patientId);
  const { 
    messages, 
    setMessages, 
    isFetchingHistory, 
    conversationHistory, 
    setConversationHistory 
  } = useChatHistory(patientId, isClinicianView);
  const { saveMessageToDatabase } = useMessageService();
  const { sendToAI, isLoading } = useAIService();
  const { checkMessageLimit, messageData } = useMessageLimits();
  const { triggerManualLearning } = useAILearning();
  const { anonymizeText } = useAnonymization();

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Check message limits for patients (clinicians have unlimited)
    if (!isClinicianView) {
      const canSend = await checkMessageLimit();
      if (!canSend) {
        toast({
          title: "Daily Message Limit Reached",
          description: `You've used all ${messageData.dailyLimit} messages today. Upgrade to Personal plan for unlimited messages.`,
          variant: "destructive",
        });
        return;
      }
    }
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // IMPORTANT: Determine the correct user ID for saving messages
    // - If clinician view, use the logged-in user's ID (clinician's own chat)
    // - If patient view, use patientId (could be own ID or patient being viewed)
    const messageOwnerId = isClinicianView ? user?.id : patientId;
    
    // Anonymize message before saving if enabled
    const anonymizedMessage = await anonymizeText(messageText);
    
    // Save anonymized user message to database with the correct owner ID
    await saveMessageToDatabase('user', anonymizedMessage, messageOwnerId);
    
    // Get AI response
    const aiResponse = await sendToAI(
      messageText, 
      conversationHistory, 
      personalizedSystemPrompt,
      setConversationHistory,
      isClinicianView,
      patientId
    );
    
    if (aiResponse) {
      // Add AI response to chat
      const aiMessage: Message = {
        id: uuidv4(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      
      // Anonymize AI response before saving if enabled
      const anonymizedResponse = await anonymizeText(aiResponse);
      
      // Save anonymized AI response to database with the correct owner ID
      await saveMessageToDatabase('assistant', anonymizedResponse, messageOwnerId);
    }
  };

  const refreshMessages = async () => {
    // Force refetch chat history to show voice conversation
    // Use the correct owner ID: clinician's own ID if clinician view, otherwise patientId
    const messageOwnerId = isClinicianView ? user?.id : (patientId || user?.id);
    
    const { data } = await supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', messageOwnerId)
      .order('created_at', { ascending: true });
    
    if (data && data.length > 0) {
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        type: msg.role === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
        content: msg.message,
        timestamp: new Date(msg.created_at)
      }));
      
      setMessages(formattedMessages);
    }
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    handleSendMessage,
    messageData,
    refreshMessages
  };
}
