
import { Button } from "@/components/ui/button";
import { Mic, Mic as MicIcon, Send, Volume2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AIChatBubble } from "./AIChatBubble";
import { supabase } from "@/integrations/supabase/client";

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface AudioChatInterfaceProps {
  isClinicianView?: boolean;
  clinicianName?: string;
}

export function AudioChatInterface({
  isClinicianView,
  clinicianName = "Martinez"
}: AudioChatInterfaceProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: string, content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      setIsRecording(true);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone"
      });
    } catch (error) {
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to record",
        variant: "destructive"
      });
    }
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // This is a placeholder for actual speech-to-text functionality
    const transcribedText = "Voice message transcription would appear here";
    handleSendMessage(transcribedText);
  };

  // Function to send message to OpenAI API via Edge Function
  const sendToAI = async (messageContent: string) => {
    setIsLoading(true);
    try {
      // Add the new user message to the conversation history
      const updatedHistory = [...conversationHistory, { role: 'user', content: messageContent }];
      
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: {
          messages: updatedHistory
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

  const handleSendMessage = async (text?: string) => {
    const messageToSend = text || newMessage.trim();
    if (!messageToSend) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageToSend,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Get AI response
    const aiResponse = await sendToAI(messageToSend);
    
    // Add AI response to chat
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMessage]);
  };

  return (
    <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-32px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        {!isClinicianView && (
          <h1 className="text-2xl font-bold -mb-1">Dr. {clinicianName} AI</h1>
        )}
        <Button variant="outline" size="sm" onClick={() => setIsVoiceMode(!isVoiceMode)} className="gap-2">
          {isVoiceMode ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
        </Button>
      </div>
      
      <Card className="flex-1 p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-8">
              <p>Start a conversation with Dr. {clinicianName} AI.</p>
              <p className="text-sm mt-2">You can ask about coping strategies, mental health tips, or schedule a session with your real clinician.</p>
            </div>
          ) : (
            messages.map(message => (
              <AIChatBubble 
                key={message.id} 
                type={message.type} 
                content={message.content} 
                timestamp={message.timestamp} 
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </Card>

      <div className="flex gap-2">
        {isVoiceMode ? (
          <Button 
            onClick={isRecording ? handleStopRecording : handleStartRecording} 
            className="w-full gap-2" 
            variant={isRecording ? "destructive" : "default"}
            disabled={isLoading}
          >
            {isRecording ? (
              <>
                <Mic className="h-4 w-4 animate-pulse" />
                Stop Recording
              </>
            ) : (
              <>
                <MicIcon className="h-4 w-4" />
                Start Recording
              </>
            )}
          </Button>
        ) : (
          <div className="flex w-full gap-2">
            <Input 
              value={newMessage} 
              onChange={e => setNewMessage(e.target.value)} 
              placeholder="Type your message..." 
              onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendMessage()} 
              className="flex-1" 
              disabled={isLoading}
            />
            <Button 
              onClick={() => handleSendMessage()} 
              disabled={!newMessage.trim() || isLoading}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
