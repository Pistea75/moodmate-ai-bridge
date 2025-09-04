
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Mic } from "lucide-react";
import { FeatureGate } from '../common/FeatureGate';

interface TextInputModeProps {
  onSendMessage: (message: string) => Promise<void>;
  onVoiceRecord?: () => void;
  isLoading: boolean;
}

export function TextInputMode({ onSendMessage, onVoiceRecord, isLoading }: TextInputModeProps) {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (newMessage.trim() && !isLoading) {
      await onSendMessage(newMessage);
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
      <FeatureGate capability="voiceChat">
        <Button 
          variant="outline"
          onClick={onVoiceRecord}
          disabled={isLoading}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </FeatureGate>
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
