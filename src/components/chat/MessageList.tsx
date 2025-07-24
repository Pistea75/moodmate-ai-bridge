
import React, { useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { AIChatBubble } from "@/components/AIChatBubble";

type Message = {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface MessageListProps {
  messages: Message[];
  clinicianName: string;
}

export function MessageList({ messages, clinicianName }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div 
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]"
      style={{ scrollBehavior: 'smooth' }}
    >
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground p-8">
            <p className="text-lg font-medium mb-2">Start a conversation with Dr. {clinicianName} AI</p>
            <p className="text-sm">You can ask about coping strategies, mental health tips, or schedule a session with your real clinician.</p>
          </div>
        </div>
      ) : (
        <>
          {messages.map(message => (
            <AIChatBubble 
              key={message.id} 
              type={message.type} 
              content={message.content} 
              timestamp={message.timestamp} 
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
