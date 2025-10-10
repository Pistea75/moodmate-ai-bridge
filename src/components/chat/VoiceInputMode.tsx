import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader } from 'lucide-react';
import { useRealtimeVoiceChat } from '@/hooks/useRealtimeVoiceChat';

export interface VoiceInputModeProps {
  onSendMessage?: (text: string) => Promise<void> | void;
  isLoading?: boolean;
  language?: string;
}

export function VoiceInputMode(props: VoiceInputModeProps) {
  const [messages, setMessages] = useState<Array<{ role: string; content: string; id: string }>>([]);
  
  const handleTranscript = (text: string, isUser: boolean) => {
    if (text.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: isUser ? 'user' : 'assistant',
        content: text
      }]);
    }
  };

  const { 
    isConnected, 
    isConnecting,
    isSpeaking, 
    userTranscript, 
    aiTranscript,
    connect, 
    disconnect 
  } = useRealtimeVoiceChat({ 
    instructions: "Eres un asistente de salud mental útil y empático. Mantén tus respuestas naturales y conversacionales.",
    onTranscript: handleTranscript
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
    <div className="flex flex-col items-center justify-center p-8 space-y-8">
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

      {/* Status and Transcription */}
      <div className="text-center space-y-4 max-w-2xl">
        <div className="text-2xl font-semibold text-foreground">
          {getStatusText()}
        </div>
        
        {/* Live transcription */}
        {(userTranscript || aiTranscript) && (
          <div className="space-y-3">
            {userTranscript && (
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                  Tú estás diciendo:
                </div>
                <div className="text-muted-foreground italic">
                  {userTranscript}
                </div>
              </div>
            )}
            
            {aiTranscript && (
              <div className="bg-muted/50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="text-sm font-medium text-green-600 dark:text-green-400 mb-1">
                  AI está diciendo:
                </div>
                <div className="text-muted-foreground italic">
                  {aiTranscript}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        {!isConnected && !isConnecting && (
          <div className="text-muted-foreground text-center max-w-md mx-auto">
            Toca el botón para iniciar una conversación de voz natural con la IA. 
            La conversación será continua - simplemente habla y la IA responderá automáticamente.
          </div>
        )}
        
        {isConnected && !isSpeaking && (
          <div className="text-muted-foreground text-center max-w-md mx-auto">
            Conversación activa. Simplemente comienza a hablar y la IA responderá automáticamente.
          </div>
        )}
      </div>

      {/* Recent Messages (last 3) */}
      {messages.length > 0 && (
        <div className="w-full max-w-2xl space-y-3">
          <div className="text-sm font-medium text-muted-foreground text-center mb-4">
            Conversación reciente
          </div>
          {messages.slice(-3).map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 ml-8'
                  : 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 mr-8'
              }`}
            >
              <div className={`text-xs font-medium mb-1 ${
                message.role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'
              }`}>
                {message.role === 'user' ? 'Tú' : 'AI'}
              </div>
              <div className="text-sm text-foreground">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}