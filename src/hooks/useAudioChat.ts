
import { v4 as uuidv4 } from "uuid";
import { usePersonalization } from "./audioChat/usePersonalization";
import { useChatHistory } from "./audioChat/useChatHistory";
import { useMessageService } from "./audioChat/useMessageService";
import { useAIService } from "./audioChat/useAIService";
import { Message } from "./audioChat/types";

export function useAudioChat(baseSystemPrompt: string, patientId?: string) {
  const personalizedSystemPrompt = usePersonalization(baseSystemPrompt);
  const { 
    messages, 
    setMessages, 
    isFetchingHistory, 
    conversationHistory, 
    setConversationHistory 
  } = useChatHistory();
  const { saveMessageToDatabase } = useMessageService();
  const { sendToAI, isLoading } = useAIService();

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Save user message to database
    await saveMessageToDatabase('user', messageText);
    
    // Get AI response
    const aiResponse = await sendToAI(
      messageText, 
      conversationHistory, 
      personalizedSystemPrompt,
      setConversationHistory
    );
    
    // Add AI response to chat
    const aiMessage: Message = {
      id: uuidv4(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
    
    // Save AI response to database
    await saveMessageToDatabase('assistant', aiResponse);
  };

  return {
    messages,
    isLoading,
    isFetchingHistory,
    handleSendMessage
  };
}
