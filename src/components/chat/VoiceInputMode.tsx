import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { useHybridSTT } from '@/hooks/useHybridSTT';

export interface VoiceInputModeProps {
  onSendMessage: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  language?: string;
}

export function VoiceInputMode(props: VoiceInputModeProps) {
  const { onSendMessage, isLoading } = props;
  const language = props.language ?? 'es-ES';

  const [transcript, setTranscript] = useState<string>('');

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
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      {/* Large circular recording button */}
      <div className="relative">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={Boolean(isLoading) || isProcessing}
          className={`
            relative w-24 h-24 rounded-full border-4 transition-all duration-300 ease-in-out
            ${isRecording 
              ? 'bg-red-500 border-red-400 animate-pulse shadow-lg shadow-red-500/50' 
              : 'bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500'
            }
            ${(Boolean(isLoading) || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            flex items-center justify-center
          `}
        >
          {isRecording ? (
            <Square className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
        </button>
        
        {/* Recording indicator rings */}
        {isRecording && (
          <>
            <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-red-400 animate-ping opacity-75" />
            <div className="absolute inset-0 w-28 h-28 -m-2 rounded-full border border-red-300 animate-ping opacity-50" />
          </>
        )}
      </div>

      {/* Status text */}
      <div className="text-center space-y-2">
        <div className="text-lg font-medium text-gray-900 dark:text-gray-100">
          {isProcessing
            ? 'Procesando audio...'
            : isRecording
            ? 'Escuchando...'
            : 'Toca para hablar'}
        </div>
        
        {transcript && (
          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            <span className="font-medium">Transcripción:</span> {transcript}
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !transcript && (
        <div className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-sm">
          Mantén presionado para grabar tu mensaje de voz
        </div>
      )}
    </div>
  );
}