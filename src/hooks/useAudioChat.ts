
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
  const { learnFromConversation } = useAILearning();

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
      
      // If this is a clinician configuring AI for a patient, learn from the conversation
      if (isClinicianView && patientId && user) {
        const recentMessages = [
          { role: 'user' as const, content: messageText },
          { role: 'assistant' as const, content: aiResponse }
        ];
        
        // Add previous conversation context for better learning
        const contextMessages = messages.slice(-4).map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));
        
        const fullConversation = [...contextMessages, ...recentMessages];
        
        // Trigger AI learning (non-blocking)
        learnFromConversation(patientId, fullConversation).catch(error => {
          console.error('Error during AI learning:', error);
        });
      }
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
