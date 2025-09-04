import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVoiceSettings } from './useVoiceSettings';

interface UseTTSProps {
  onAudioStart?: () => void;
  onAudioEnd?: () => void;
  onError?: (error: string) => void;
  onQuotaError?: () => void;
}

export function useTTS({ onAudioStart, onAudioEnd, onError, onQuotaError }: UseTTSProps = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useVoiceSettings();
  const { toast } = useToast();
  
  const playText = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    try {
      setIsLoading(true);
      onAudioStart?.();

      // Call the text-to-speech edge function
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: {
          text: text,
          voice: settings.ttsVoice,
          language: settings.ttsLanguage
        }
      });

      if (error) {
        console.error('TTS function error:', error);
        const errorMessage = error.message || 'Text-to-speech service failed';
        
        // Check if it's a quota/credit error
        if (errorMessage.includes('insufficient') || errorMessage.includes('quota') || errorMessage.includes('credits')) {
          onQuotaError?.();
          return; // Don't throw, just return silently
        }
        
        throw new Error(errorMessage);
      }

      if (!data?.audioContent) {
        throw new Error('No audio data received');
      }

      // Create audio element and play
      const audioBlob = new Blob([
        Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))
      ], { type: 'audio/mp3' });
      
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsPlaying(true);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        onAudioEnd?.();
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        const errorMsg = 'Failed to play audio';
        onError?.(errorMsg);
        toast({
          title: "Audio Error",
          description: errorMsg,
          variant: "destructive"
        });
      };

      await audio.play();
      
    } catch (error) {
      console.error('TTS Error:', error);
      setIsPlaying(false);
      const errorMsg = error instanceof Error ? error.message : 'Text-to-speech failed';
      
      // Check if it's a quota/credit error
      if (errorMsg.includes('insufficient') || errorMsg.includes('quota') || errorMsg.includes('credits')) {
        onQuotaError?.();
        return; // Don't call onError for quota issues
      }
      
      onError?.(errorMsg);
      
      // Suppress all error toasts for TTS to prevent spam
      // Error handling is done at component level
    } finally {
      setIsLoading(false);
    }
  }, [settings.ttsVoice, settings.ttsLanguage, onAudioStart, onAudioEnd, onError, toast]);

  const stopAudio = useCallback(() => {
    // Since we're creating new Audio elements each time,
    // we can't directly stop them. This is a placeholder for future enhancement.
    setIsPlaying(false);
  }, []);

  return {
    playText,
    stopAudio,
    isPlaying,
    isLoading
  };
}