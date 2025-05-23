
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function useAudioChat(systemPrompt: string) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);

  // Function to send message to OpenAI API via Edge Function
  const sendToAI = async (messageContent: string) => {
    setIsLoading(true);
    try {
      // Add the new user message to the conversation history
      const updatedHistory = [...conversationHistory, { role: 'user', content: messageContent }];
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: updatedHistory,
          systemPrompt
        }
      });

      if (error) throw new Error(error.message);
      
      // Add the AI response to the conversation history
      setConversationHistory([...updatedHistory, { 
        role: 'assistant', 
        content: data.reply.content 
      }]);
      
      return data.reply.content;
    } catch (error) {
      console.error("Error calling AI:", error);
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive"
      });
      return "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Get AI response
    const aiResponse = await sendToAI(messageText);
    
    // Add AI response to chat
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  return {
    messages,
    isLoading,
    handleSendMessage
  };
}
