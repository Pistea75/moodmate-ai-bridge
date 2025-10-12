import { useState, useRef, useCallback } from 'react';
import { RealtimeChat } from '@/utils/RealtimeAudio';
import { useToast } from '@/hooks/use-toast';
import { useMessageService } from '@/hooks/audioChat/useMessageService';
import { useAuth } from '@/contexts/AuthContext';

interface UseRealtimeVoiceChatProps {
  instructions?: string;
  onTranscript?: (text: string, isUser: boolean) => void;
  patientId?: string;
  voice?: string;
}

export function useRealtimeVoiceChat({ 
  instructions, 
  onTranscript,
  patientId,
  voice = 'alloy'
}: UseRealtimeVoiceChatProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [userTranscript, setUserTranscript] = useState('');
  const [aiTranscript, setAiTranscript] = useState('');
  const chatRef = useRef<RealtimeChat | null>(null);
  const { toast } = useToast();
  const { saveMessageToDatabase } = useMessageService();
  const { user } = useAuth();
  const currentUserMessageRef = useRef('');
  const currentAIMessageRef = useRef('');

  const handleMessage = useCallback((event: any) => {
    console.log('Received event:', event.type);

    switch (event.type) {
      case 'response.audio_transcript.delta':
        const aiDelta = event.delta || '';
        currentAIMessageRef.current += aiDelta;
        setAiTranscript(prev => prev + aiDelta);
        onTranscript?.(aiDelta, false);
        break;
      case 'response.audio_transcript.done':
        // Save complete AI message to database
        if (currentAIMessageRef.current.trim() && user) {
          saveMessageToDatabase('assistant', currentAIMessageRef.current, patientId);
          currentAIMessageRef.current = '';
        }
        setAiTranscript('');
        break;
      case 'conversation.item.input_audio_transcription.completed':
        const userText = event.transcript || '';
        currentUserMessageRef.current = userText;
        setUserTranscript(userText);
        onTranscript?.(userText, true);
        // Save user message to database
        if (userText.trim() && user) {
          saveMessageToDatabase('user', userText, patientId);
        }
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
  }, [onTranscript, toast, saveMessageToDatabase, user, patientId]);

  const handleConnectionChange = useCallback((connected: boolean) => {
    setIsConnected(connected);
    setIsConnecting(false);
  }, []);

  const connect = useCallback(async () => {
    // Prevent multiple simultaneous connections
    if (isConnecting || isConnected || chatRef.current) {
      console.log('Already connecting or connected');
      return;
    }

    try {
      setIsConnecting(true);
      chatRef.current = new RealtimeChat(handleMessage, handleConnectionChange);
      await chatRef.current.init(instructions, voice);
      
      toast({
        title: "Conectado",
        description: "Chat de voz listo",
      });
    } catch (error) {
      console.error('Error connecting:', error);
      setIsConnecting(false);
      chatRef.current = null;
      toast({
        title: "Error de Conexión",
        description: error instanceof Error ? error.message : 'Fallo al conectar',
        variant: "destructive",
      });
    }
  }, [instructions, voice, handleMessage, handleConnectionChange, toast, isConnecting, isConnected]);

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
