import { useState, useRef, useCallback } from 'react';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from '@/hooks/use-toast';

interface UseRealtimeVoiceChatProps {
  instructions?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
}

export function useRealtimeVoiceChat({ instructions, onTranscript }: UseRealtimeVoiceChatProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');
  const chatRef = useRef<RealtimeChat | null>(null);
  const { toast } = useToast();

  const handleMessage = useCallback((event: any) => {
    console.log('Received event:', event.type);

    switch (event.type) {
      case 'response.audio_transcript.delta':
        setAiTranscript(prev => prev + (event.delta || ''));
        onTranscript?.(event.delta || '', false);
        break;
      case 'response.audio_transcript.done':
        setAiTranscript('');
        break;
      case 'conversation.item.input_audio_transcription.completed':
        setUserTranscript(event.transcript || '');
        onTranscript?.(event.transcript || '', true);
        break;
      case 'input_audio_buffer.speech_started':
        console.log('User started speaking');
        break;
      case 'input_audio_buffer.speech_stopped':
        console.log('User stopped speaking');
        setUserTranscript('');
        break;
      case 'response.audio.delta':
        setIsSpeaking(true);
        break;
      case 'response.audio.done':
        setIsSpeaking(false);
        break;
      case 'error':
        console.error('Realtime API error:', event);
        toast({
          title: "Error",
          description: event.error?.message || 'An error occurred',
          variant: "destructive"
        });
        break;
    }
  }, [onTranscript, toast]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(async () => {
    try {
      setIsConnecting(true);
      chatRef.current = new RealtimeChat(handleMessage, handleConnectionChange);
      await chatRef.current.init(instructions);
      
      toast({
        title: "Connected",
        description: "Voice chat is ready",
      });
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnecting(false);
      toast({
        title: "Connection Error",
        description: error instanceof Error ? error.message : 'Failed to connect',
        variant: "destructive",
      });
    }
  }, [instructions, handleMessage, handleConnectionChange, toast]);

  const disconnect = useCallback(() => {
    chatRef.current?.disconnect();
    chatRef.current = null;
    setIsConnected(false);
    setIsSpeaking(false);
    setUserTranscript('');
    setAiTranscript('');
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!chatRef.current) {
      throw new Error('Not connected');
    }
    await chatRef.current.sendMessage(text);
  }, []);

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    userTranscript,
    aiTranscript,
    connect,
    disconnect,
    sendMessage
  };
}
