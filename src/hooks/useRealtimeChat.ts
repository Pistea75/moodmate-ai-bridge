import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AudioRecorder, AudioQueue, encodeAudioForAPI, createWavFromPCM } from '@/utils/audioUtils';

export interface RealtimeMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTranscription?: boolean;
}

export interface RealtimeState {
  isConnected: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  messages: RealtimeMessage[];
  userTranscript: string;
  assistantTranscript: string;
}

export function useRealtimeChat() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<RealtimeState>({
    isConnected: false,
    isListening: false,
    isSpeaking: false,
    messages: [],
    userTranscript: '',
    assistantTranscript: ''
  });

  const websocketRef = useRef<WebSocket | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<AudioQueue | null>(null);

  const updateState = useCallback((updates: Partial<RealtimeState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const initializeAudio = useCallback(async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext({ sampleRate: 24000 });
        audioQueueRef.current = new AudioQueue(audioContextRef.current);
      }

      if (!audioRecorderRef.current) {
        audioRecorderRef.current = new AudioRecorder((audioData: Float32Array) => {
          if (websocketRef.current?.readyState === WebSocket.OPEN) {
            const encodedAudio = encodeAudioForAPI(audioData);
            websocketRef.current.send(JSON.stringify({
              type: 'input_audio_buffer.append',
              audio: encodedAudio
            }));
          }
        });
        await audioRecorderRef.current.start();
      }
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
      toast({
        variant: 'destructive',
        title: 'Audio Error',
        description: 'Failed to access microphone'
      });
    }
  }, [toast]);

  const connect = useCallback(async () => {
    if (!user) return;

    try {
      // Initialize audio first
      await initializeAudio();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host.includes('localhost') 
        ? 'localhost:54321' 
        : `otrhbyzjrhsqrltdedon.functions.supabase.co`;
      
      const wsUrl = `${protocol}//${host}/functions/v1/realtime-chat`;
      
      console.log('🔗 Connecting to:', wsUrl);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) throw new Error('No access token');

      websocketRef.current = new WebSocket(wsUrl);
      
      // Add auth headers after connection
      websocketRef.current.onopen = () => {
        console.log('✅ WebSocket connected');
        updateState({ isConnected: true });
        
        // Send authentication
        websocketRef.current?.send(JSON.stringify({
          type: 'auth',
          token: token
        }));
      };

      websocketRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received:', data.type);

          switch (data.type) {
            case 'session.created':
              console.log('🎉 Session created');
              break;

            case 'input_audio_buffer.speech_started':
              updateState({ isListening: true, userTranscript: '' });
              break;

            case 'input_audio_buffer.speech_stopped':
              updateState({ isListening: false });
              break;

            case 'conversation.item.input_audio_transcription.completed':
              const userMessage: RealtimeMessage = {
                id: data.item_id || Date.now().toString(),
                role: 'user',
                content: data.transcript || '',
                timestamp: new Date()
              };
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, userMessage],
                userTranscript: ''
              }));
              break;

            case 'response.audio.delta':
              if (data.delta && audioQueueRef.current) {
                updateState({ isSpeaking: true });
                // Convert base64 to Uint8Array
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await audioQueueRef.current.addToQueue(bytes);
              }
              break;

            case 'response.audio_transcript.delta':
              setState(prev => ({
                ...prev,
                assistantTranscript: prev.assistantTranscript + (data.delta || '')
              }));
              break;

            case 'response.audio_transcript.done':
              const assistantMessage: RealtimeMessage = {
                id: data.item_id || Date.now().toString(),
                role: 'assistant',
                content: state.assistantTranscript,
                timestamp: new Date()
              };
              setState(prev => ({
                ...prev,
                messages: [...prev.messages, assistantMessage],
                assistantTranscript: ''
              }));
              break;

            case 'response.audio.done':
              updateState({ isSpeaking: false });
              break;

            case 'error':
              console.error('❌ Server error:', data.message);
              toast({
                variant: 'destructive',
                title: 'Connection Error',
                description: data.message
              });
              break;

            case 'openai_disconnected':
              updateState({ isConnected: false });
              toast({
                variant: 'destructive',
                title: 'AI Disconnected',
                description: 'Lost connection to AI service'
              });
              break;
          }
        } catch (error) {
          console.error('❌ Error processing message:', error);
        }
      };

      websocketRef.current.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
        toast({
          variant: 'destructive',
          title: 'Connection Error',
          description: 'Failed to connect to voice chat'
        });
      };

      websocketRef.current.onclose = () => {
        console.log('🔌 WebSocket closed');
        updateState({ isConnected: false, isListening: false, isSpeaking: false });
      };

    } catch (error) {
      console.error('❌ Failed to connect:', error);
      toast({
        variant: 'destructive',
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, [user, initializeAudio, updateState, toast, state.assistantTranscript]);

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
    
    if (audioRecorderRef.current) {
      audioRecorderRef.current.stop();
      audioRecorderRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      audioQueueRef.current = null;
    }

    updateState({ 
      isConnected: false, 
      isListening: false, 
      isSpeaking: false,
      userTranscript: '',
      assistantTranscript: ''
    });
  }, [updateState]);

  const sendTextMessage = useCallback((text: string) => {
    if (!websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      console.warn('⚠️ WebSocket not connected');
      return;
    }

    const event = {
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [
          {
            type: 'input_text',
            text: text
          }
        ]
      }
    };

    websocketRef.current.send(JSON.stringify(event));
    websocketRef.current.send(JSON.stringify({ type: 'response.create' }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendTextMessage
  };
}