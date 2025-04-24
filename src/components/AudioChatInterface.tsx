import { Button } from "@/components/ui/button";
import { Mic, Mic as MicIcon, Send, Volume2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AIChatBubble } from "./AIChatBubble";

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface AudioChatInterfaceProps {
  isClinicianView?: boolean;
}

export function AudioChatInterface({
  isClinicianView
}: AudioChatInterfaceProps) {
  const {
    toast
  } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isVoiceMode, setIsVoiceMode] = useState(false);

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
    // Simulate receiving a response
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: "Voice message transcription would appear here",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I understand your message. How else can I assist you?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "Thank you for your message. How can I help you further?",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return <div className="h-[calc(100vh-160px)] md:h-[calc(100vh-32px)] flex flex-col">
      <div className="flex flex-col mb-4">
        <div className="flex items-center justify-between">
          <div>
            {!isClinicianView && <h1 className="text-2xl font-bold -mb-1">Dr. Martinez AI</h1>}
            
          </div>
          <Button variant="outline" size="sm" onClick={() => setIsVoiceMode(!isVoiceMode)} className="gap-2">
            {isVoiceMode ? <Volume2 className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isVoiceMode ? 'Text Mode' : 'Voice Mode'}
          </Button>
        </div>
      </div>
      
      <Card className="flex-1 p-4 mb-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map(message => <AIChatBubble key={message.id} type={message.type} content={message.content} timestamp={message.timestamp} />)}
        </div>
      </Card>

      <div className="flex gap-2">
        {isVoiceMode ? <Button onClick={isRecording ? handleStopRecording : handleStartRecording} className="w-full gap-2" variant={isRecording ? "destructive" : "default"}>
            {isRecording ? <>
                <Mic className="h-4 w-4 animate-pulse" />
                Stop Recording
              </> : <>
                <MicIcon className="h-4 w-4" />
                Start Recording
              </>}
          </Button> : <div className="flex w-full gap-2">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type your message..." onKeyDown={e => e.key === 'Enter' && handleSendMessage()} className="flex-1" />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>}
      </div>
    </div>;
}
