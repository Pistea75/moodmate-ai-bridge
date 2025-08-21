
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useHybridSTT } from '@/hooks/useHybridSTT';

export interface VoiceInputModeProps {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  // idioma opcional; si no viene, usamos 'es-ES'
  language?: string;
}

export function VoiceInputMode(props: VoiceInputModeProps) {
  const { onSendMessage, isLoading } = props;
  const language = props.language ?? 'es-ES';

  const [transcript, setTranscript] = useState<string>('');

  // NO hacemos destructuring directo para evitar TS1005 en algunos setups
  const stt = useHybridSTT({
    language,
    onTranscription: async (text, method) => {
      console.log('🎤 VoiceInputMode - Transcription received:', { text, method });
      setTranscript(text);
      try {
        await onSendMessage(String(text));
        console.log('✅ VoiceInputMode - Message sent successfully');
      } catch (error) {
        console.error('❌ VoiceInputMode - Error sending message:', error);
      }
    },
    onError: (err) => {
      console.error('❌ VoiceInputMode - STT Error:', err);
    },
  });

  const isRecording = stt.isRecording;
  const isProcessing = stt.isProcessing;
  const startRecording = stt.startRecording;
  const stopRecording = stt.stopRecording;

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button onClick={startRecording} disabled={Boolean(isLoading) || isProcessing}>
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
