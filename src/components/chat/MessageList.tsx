
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
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
  );
}
