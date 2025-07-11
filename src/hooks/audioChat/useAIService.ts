
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ConversationMessage } from "./types";

export function useAIService() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const sendToAI = async (
    messageContent: string, 
    conversationHistory: ConversationMessage[], 
    personalizedSystemPrompt: string,
    setConversationHistory: (history: ConversationMessage[]) => void,
    isClinicianView: boolean = false
  ) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages",
        variant: "destructive"
      });
      return "Please log in to continue this conversation.";
    }
    
    setIsLoading(true);
    try {
      const updatedHistory = [...conversationHistory, { role: 'user', content: messageContent }];
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: updatedHistory,
          systemPrompt: personalizedSystemPrompt,
          userId: user.id,
          isClinicianView: isClinicianView
        }
      });

      if (error) throw new Error(error.message);
      
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

  return { sendToAI, isLoading };
}
