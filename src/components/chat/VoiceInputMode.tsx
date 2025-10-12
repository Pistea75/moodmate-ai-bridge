import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Volume2, X } from 'lucide-react';
import { useRealtimeVoiceChat } from '@/hooks/useRealtimeVoiceChat';

export interface VoiceInputModeProps {
  onSendMessage?: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  language?: string;
  onClose?: () => void;
}

export function VoiceInputMode(props: VoiceInputModeProps) {
  const { 
    isConnected, 
    isConnecting,
    isSpeaking, 
    connect, 
    disconnect 
  } = useRealtimeVoiceChat({ 
    instructions: "Eres un asistente de salud mental útil y empático. Mantén tus respuestas naturales y conversacionales.",
  });

  const getStatusText = () => {
    if (isConnecting) return 'Conectando...';
    if (!isConnected) return 'Toca para comenzar';
    if (isSpeaking) return 'AI hablando...';
    return 'Escuchando...';
  };

  const getButtonState = () => {
    if (isConnecting) return 'connecting';
    if (!isConnected) return 'ready';
    if (isSpeaking) return 'speaking';
    return 'listening';
  };

  const buttonState = getButtonState();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-8 relative">
      {/* Close Button */}
      {props.onClose && (
        <Button
          variant="ghost"
          size="icon"
          onClick={props.onClose}
          className="absolute top-4 right-4"
        >
          <X className="h-5 w-5" />
        </Button>
      )}

      {/* Connection/Control Button */}
      <div className="relative">
        <button
          onClick={isConnected ? disconnect : connect}
          disabled={buttonState === 'connecting'}
          className={`
            relative w-32 h-32 rounded-full border-4 transition-all duration-500 ease-in-out
            flex items-center justify-center text-white font-medium
            ${buttonState === 'listening' 
              ? 'bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 shadow-2xl shadow-blue-500/40' 
              : buttonState === 'speaking'
              ? 'bg-gradient-to-br from-green-500 to-green-600 border-green-400 shadow-2xl shadow-green-500/40 animate-pulse'
              : buttonState === 'connecting'
              ? 'bg-gradient-to-br from-gray-500 to-gray-600 border-gray-400 opacity-75'
              : 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600 hover:from-gray-600 hover:to-gray-700 hover:border-gray-500 hover:shadow-xl'
            }
            ${buttonState === 'connecting' ? 'cursor-not-allowed' : 'cursor-pointer'}
            transform hover:scale-105 active:scale-95
          `}
        >
          {buttonState === 'connecting' && (
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
          )}
          {buttonState === 'listening' && (
            <Mic className="h-12 w-12" />
          )}
          {buttonState === 'speaking' && (
            <Volume2 className="h-12 w-12" />
          )}
          {buttonState === 'ready' && (
            <Mic className="h-12 w-12" />
          )}
        </button>
        
        {/* Animated rings for active states */}
        {(buttonState === 'listening' || buttonState === 'speaking') && (
          <>
            <div className={`absolute inset-0 w-32 h-32 rounded-full border-2 animate-ping opacity-75 ${
              buttonState === 'listening' ? 'border-blue-400' : 'border-green-400'
            }`} />
            <div className={`absolute inset-0 w-40 h-40 -m-4 rounded-full border animate-ping opacity-50 ${
              buttonState === 'listening' ? 'border-blue-300' : 'border-green-300'
            }`} />
            <div className={`absolute inset-0 w-48 h-48 -m-8 rounded-full border animate-ping opacity-25 ${
              buttonState === 'listening' ? 'border-blue-200' : 'border-green-200'
            }`} />
          </>
        )}
      </div>

      {/* Status Text */}
      <div className="text-2xl font-semibold text-foreground">
        {getStatusText()}
      </div>
    </div>
  );
}