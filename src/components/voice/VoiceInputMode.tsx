import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useHybridSTT } from '@/hooks/useHybridSTT';

type VoiceInputModeProps = {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading?: boolean;
};

export function VoiceInputMode({ onSendMessage, isLoading }: VoiceInputModeProps) {
  const [transcript, setTranscript] = useState<string>('');

  const { 
    isRecording, 
    isProcessing, 
    startRecording, 
    stopRecording 
  } = useHybridSTT({
    language: 'es-UY', 'en-US' // o el idioma que necesites
    onTranscription: async (text) => {
      setTranscript(text);
      await onSendMessage(text); // Envía el mensaje automáticamente
    },
    onError: (err) => {
      console.error('STT Error:', err);
    }
  });

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button onClick={startRecording} disabled={isLoading || isProcessing}>
          <Mic className="h-4 w-4 mr-2" /> Hablar
        </Button>
      ) : (
        <Button variant="destructive" onClick={stopRecording}>
          <Square className="h-4 w-4 mr-2" /> Detener
        </Button>
      )}

      <div className="text-sm opacity-70 truncate">
        {isProcessing 
          ? 'Procesando...' 
          : transcript 
            ? `Transcripción: ${transcript}` 
            : isRecording 
              ? 'Grabando...' 
              : 'Tocá “Hablar” para empezar'}
      </div>
    </div>
  );
}
