
import { v4 as uuidv4 } from "uuid";
import { usePersonalization } from "./audioChat/usePersonalization";
import { useChatHistory } from "./audioChat/useChatHistory";
import { useMessageService } from "./audioChat/useMessageService";
import { useAIService } from "./audioChat/useAIService";
import { useMessageLimits } from "./useMessageLimits";
import { useAILearning } from "./useAILearning";
import { Message } from "./audioChat/types";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useAudioChat(baseSystemPrompt: string, patientId?: string, isClinicianView: boolean = false) {
  const { user } = useAuth();
  const personalizedSystemPrompt = usePersonalization(baseSystemPrompt, patientId);
  const { 
    messages, 
    setMessages, 
    isFetchingHistory, 
    conversationHistory, 
    setConversationHistory 
  } = useChatHistory();
  const { saveMessageToDatabase } = useMessageService();
  const { sendToAI, isLoading } = useAIService();
  const { checkMessageLimit, messageData } = useMessageLimits();
  const { triggerManualLearning } = useAILearning();

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
    
    // Save user message to database
    await saveMessageToDatabase('user', messageText, patientId);
    
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
      
      // Save AI response to database
      await saveMessageToDatabase('assistant', aiResponse, patientId);
    }
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    handleSendMessage,
    messageData
  };
}
