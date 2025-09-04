
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
    isClinicianView: boolean = false,
    patientId?: string
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
      
      // Get current session to ensure we have a valid token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('No valid session found');
      }
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        body: {
          messages: updatedHistory,
          aiPersonality: personalizedSystemPrompt,
          patientId: patientId,
          clinicianId: isClinicianView ? user?.id : undefined
        }
      });

      if (error) throw new Error(error.message);
      
      // Check if data exists and has the expected structure
      if (!data || !data.message) {
        throw new Error('Invalid response from AI service');
      }
      
      setConversationHistory([...updatedHistory, { 
        role: 'assistant', 
        content: data.message 
      }]);
      
      return data.message;
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
