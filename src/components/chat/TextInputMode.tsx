
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface TextInputModeProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function TextInputMode({ onSendMessage, isLoading }: TextInputModeProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() && !isLoading) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="flex w-full gap-2">
      <Input 
        value={newMessage} 
        onChange={e => setNewMessage(e.target.value)} 
        placeholder="Type your message..." 
        onKeyDown={e => e.key === 'Enter' && handleSend()} 
        className="flex-1" 
        disabled={isLoading}
      />
      <Button 
        onClick={handleSend} 
        disabled={!newMessage.trim() || isLoading}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
