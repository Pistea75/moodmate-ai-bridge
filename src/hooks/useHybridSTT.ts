import { useState, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import '@/types/speech';

interface UseHybridSTTProps {
  language: string;
  onTranscription: (text: string, method: 'webspeech' | 'whisper') => void;
  onError: (error: string) => void;
}

export function useHybridSTT({ language, onTranscription, onError }: UseHybridSTTProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);

  // Check if Web Speech API is supported
  const isWebSpeechSupported = useCallback(() => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }, []);

  const startWebSpeechRecording = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onError('Web Speech API not supported');
      return false;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onstart = () => {
        console.log('Web Speech started');
        setIsRecording(true);
        startTimeRef.current = Date.now();
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
          console.log('Web Speech final result:', finalTranscript);

          // 🚨 ALERT para debug
          alert('Transcription received (WebSpeech): ' + finalTranscript);

          onTranscription(finalTranscript, 'webspeech');
          logVoiceUsage('webspeech', duration, finalTranscript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Web Speech error:', event.error);
        setIsRecording(false);
        
        switch (event.error) {
          case 'not-allowed':
            onError('Microphone access denied. Please allow microphone access.');
            break;
          case 'no-speech':
            onError('No speech detected. Please try speaking louder.');
            break;
          case 'network':
            onError('Network error. Check your internet connection.');
            break;
          default:
            onError(`Speech recognition error: ${event.error}`);
        }
      };

      recognition.onend = () => {
        console.log('Web Speech ended');
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch (error) {
      console.error('Error starting Web Speech:', error);
      onError('Failed to start speech recognition');
      return false;
    }
  }, [language, onTranscription, onError]);

  const startFallbackRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      audioChunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
        
        if (audioChunksRef.current.length === 0) {
          onError('No audio recorded');
          return;
        }

        setIsProcessing(true);

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const transcript = await sendToWhisper(audioBlob, language, duration);
          
          if (transcript) {
            // 🚨 ALERT para debug
            alert('Transcription received (Whisper): ' + transcript);

            onTranscription(transcript, 'whisper');
            logVoiceUsage('whisper_fallback', duration, transcript);
          } else {
            onError('No speech detected in recording');
          }
        } catch (error) {
          console.error('Error processing audio:', error);
          onError('Failed to process audio recording');
        } finally {
          setIsProcessing(false);
        }

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting fallback recording:', error);
      onError('Failed to access microphone');
    }
  }, [language, onTranscription, onError]);

  // FIX: usamos fetch en vez de supabase.functions.invoke para FormData
  const sendToWhisper = async (audioBlob: Blob, language: string, duration: number): Promise<string> => {
    console.log('🎤 Sending audio to Whisper:', { 
      size: audioBlob.size, 
      type: audioBlob.type, 
      language, 
      duration 
    });

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('language', language);
    formData.append('duration', duration.toString());

    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;

    const { data: { url } } = await supabase.functions.getConfig();
    const fnUrl = `${url}/speech-to-text`;

    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      body: formData,
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error('❌ Whisper HTTP error:', res.status, txt);
      throw new Error(`Whisper failed: ${res.status}`);
    }

    const data = await res.json();
    console.log('✅ Whisper transcription result:', data);
    return data.transcript || data.text || '';
  };

  const logVoiceUsage = async (method: string, duration: number, transcript: string) => {
    try {
      await supabase.from('voice_usage_logs').insert({
        type: 'stt',
        duration_seconds: duration,
        language: language,
        method: method,
        transcript_length: transcript.length
      });
      console.log('Voice usage logged:', { type: 'stt', duration, language, method, length: transcript.length });
    } catch (error) {
      console.error('Failed to log voice usage:', error);
    }
  };

  const startRecording = useCallback(() => {
    if (isWebSpeechSupported()) {
      console.log('Using Web Speech API');
      const success = startWebSpeechRecording();
      if (!success) {
        console.log('Web Speech failed, falling back to Whisper');
        startFallbackRecording();
      }
    } else {
      console.log('Using Whisper fallback');
      startFallbackRecording();
    }
  }, [isWebSpeechSupported, startWebSpeechRecording, startFallbackRecording]);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    
    setIsRecording(false);
  }, []);

  return {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    isWebSpeechSupported: isWebSpeechSupported()
  };
}

