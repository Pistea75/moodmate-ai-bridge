import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useHybridSTT } from '@/hooks/useHybridSTT';

type VoiceInputModeProps = {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  /** Opcional: idioma para STT, por defecto es-ES */
  language?: string;
};

export function VoiceInputMode({
  onSendMessage,
  isLoading,
  language = 'es-ES',
}: VoiceInputModeProps) {
  const [transcript, setTranscript] = useState<string>('');

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
  } = useHybridSTT({
    language,
    onTranscription: async (text: string, method: 'webspeech' | 'whisper') => {
      // Log para verificar que llega
      console.log('✅ onTranscription:', { text, method });
      setTranscript(text);
      await onSendMessage(String(text));
    },
    onError: (err: string) => {
      console.error('❌ STT Error:', err);
    },
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
          ? 'Procesando…'
          : transcript
          ? `Transcripción: ${transcript}`
          : isRecording
          ? 'Grabando…'
          : 'Tocá “Hablar” para empezar'}
      </div>
    </div>
  );
}
