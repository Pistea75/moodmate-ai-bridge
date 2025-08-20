
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useHybridSTT } from "@/hooks/useHybridSTT";
import { useVoiceSettings } from "@/hooks/useVoiceSettings";
import { FeatureGate } from "@/components/common/FeatureGate";

interface VoiceInputModeProps {
  onSendMessage: (message: string) => Promise<void>;
  isLoading: boolean;
}

export function VoiceInputMode({ onSendMessage, isLoading }: VoiceInputModeProps) {
  const { toast } = useToast();
  const { settings } = useVoiceSettings();
  const [transcript, setTranscript] = useState('');

  const { isRecording, isProcessing, startRecording, stopRecording } = useHybridSTT({
    language: settings.sttLanguage,
    onTranscription: async (text, method) => {
      console.log(`🎤 Transcription received via ${method}:`, text);
      setTranscript(text);
      
      if (text.trim()) {
        console.log('📤 Sending transcribed message:', text);
        await onSendMessage(text);
        setTranscript('');
      } else {
        console.warn('⚠️ Empty transcription received');
      }
    },
    onError: (error) => {
      console.error('🎤 Voice error:', error);
      toast({
        title: "Voice Error",
        description: error,
        variant: "destructive"
      });
    }
  });

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <FeatureGate capability="voiceChat">
      <div className="space-y-2">
        <Button 
          onClick={handleToggleRecording}
          className="w-full gap-2" 
          variant={isRecording ? "destructive" : "default"}
          disabled={isLoading || isProcessing}
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4" />
              Stop Recording
            </>
          ) : isProcessing ? (
            <>
              <Mic className="h-4 w-4 animate-pulse" />
              Processing...
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Recording
            </>
          )}
        </Button>
        
        {transcript && (
          <div className="p-2 bg-muted rounded text-sm">
            <span className="text-muted-foreground">Transcription: </span>
            {transcript}
          </div>
        )}
      </div>
    </FeatureGate>
  );
}
