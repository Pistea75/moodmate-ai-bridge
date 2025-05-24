
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export function useAudioChat(baseSystemPrompt: string, patientId?: string) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const [personalizedSystemPrompt, setPersonalizedSystemPrompt] = useState(baseSystemPrompt);

  // Fetch AI personalization preferences
  useEffect(() => {
    const fetchAIPersonalization = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('ai_patient_profiles')
          .select('preferences')
          .eq('patient_id', user.id)
          .maybeSingle();

        if (profile?.preferences) {
          const customSystemPrompt = `
${baseSystemPrompt}

Patient Personalization:
- Known challenges/triggers: ${profile.preferences.challenges || 'N/A'}
- Recommended strategies: ${profile.preferences.strategies || 'General CBT and mindfulness techniques'}
- Preferred tone: ${profile.preferences.tone || 'supportive and evidence-based'}
- Emergency protocols: ${profile.preferences.emergency || 'notify clinician if risk detected'}

Instructions:
- Tailor your responses based on the patient's specific challenges and triggers
- Recommend the personalized strategies when appropriate
- Maintain the preferred tone throughout the conversation
- Follow emergency protocols if concerning content is detected
- Always be empathetic and professional
          `.trim();
          
          setPersonalizedSystemPrompt(customSystemPrompt);
        }
      } catch (error) {
        console.error('Error fetching AI personalization:', error);
      }
    };

    fetchAIPersonalization();
  }, [user, baseSystemPrompt]);

  // Fetch chat history when component mounts
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) {
        setIsFetchingHistory(false);
        return;
      }

      try {
        setIsFetchingHistory(true);
        
        const { data, error } = await supabase
          .from('ai_chat_logs')
          .select('*')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: true });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Format the messages from the database
          const formattedMessages = data.map(msg => ({
            id: msg.id,
            type: msg.role === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
            content: msg.message,
            timestamp: new Date(msg.created_at)
          }));
          
          setMessages(formattedMessages);
          
          // Update conversation history for the AI
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
  }, [user, toast]);

  // Function to save message to database
  const saveMessageToDatabase = async (role: 'user' | 'assistant', message: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('ai_chat_logs')
        .insert({
          patient_id: user.id,
          role: role,
          message: message
        });
        
      if (error) {
        console.error("Error saving message to database:", error);
      }
    } catch (error) {
      console.error("Error in saveMessageToDatabase:", error);
    }
  };

  // Function to send message to OpenAI API via Edge Function
  const sendToAI = async (messageContent: string) => {
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
      // Add the new user message to the conversation history
      const updatedHistory = [...conversationHistory, { role: 'user', content: messageContent }];
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: updatedHistory,
          systemPrompt: personalizedSystemPrompt,
          userId: user.id
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
    if (!messageText.trim() || !user) return;
    
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
    const aiResponse = await sendToAI(messageText);
    
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
