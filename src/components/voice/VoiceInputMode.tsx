import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square } from 'lucide-react';
import { useHybridSTT } from '@/hooks/useHybridSTT';

interface VoiceInputModeProps {
  onSendMessage?: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  language?: string;
}

export function VoiceInputMode(props: VoiceInputModeProps) {
  const { onSendMessage, isLoading, language = 'es-ES' } = props;

  const [transcript, setTranscript] = useState<string>('');

  const stt = useHybridSTT({
    language,
    onTranscription: async (text, method) => {
      // descomentá si querés ver el popup
      // alert('Transcription received (' + method + '): ' + text);
      console.log('✅ onTranscription:', { text, method });
      setTranscript(text || '');
      if (onSendMessage) {
        await onSendMessage(String(text || ''));
      }
    },
    onError: (err) => {
      console.error('❌ STT Error:', err);
    },
  });

  const isRecording = stt.isRecording;
  const isProcessing = stt.isProcessing;
  const startRecording = stt.startRecording;
  const stopRecording = stt.stopRecording;

  return (
    <div className="flex items-center gap-2">
      {!isRecording ? (
        <Button onClick={startRecording} disabled={!!isLoading || isProcessing}>
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
