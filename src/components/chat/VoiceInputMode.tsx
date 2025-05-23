
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VoiceInputModeProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function VoiceInputMode({ onSendMessage, isLoading }: VoiceInputModeProps) {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);

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
    onSendMessage(transcribedText);
  };

  return (
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
          <Mic className="h-4 w-4" />
          Start Recording
        </>
      )}
    </Button>
  );
}
