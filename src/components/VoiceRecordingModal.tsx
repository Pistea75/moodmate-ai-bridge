import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscription: (text: string) => void;
}

export function VoiceRecordingModal({ isOpen, onClose, onTranscription }: VoiceRecordingModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopRecording();
      cleanup();
    };
  }, []);

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    chunksRef.current = [];
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      streamRef.current = stream;
      chunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        processRecording();
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Visual feedback for audio level
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateAudioLevel = () => {
        if (isRecording) {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Error",
        description: "Could not access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const processRecording = async () => {
    setIsProcessing(true);
    
    try {
      const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];
        
        try {
          const { data, error } = await supabase.functions.invoke('speech-to-text', {
            body: { audio: base64Audio }
          });

          if (error) {
            throw error;
          }

          if (data?.text) {
            onTranscription(data.text);
            onClose();
            toast({
              title: "Success",
              description: "Audio transcribed successfully!",
            });
          } else {
            throw new Error('No transcription received');
          }
        } catch (error) {
          console.error('Transcription error:', error);
          toast({
            title: "Error",
            description: "Failed to transcribe audio. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
          cleanup();
        }
      };
      
      reader.readAsDataURL(audioBlob);
    } catch (error) {
      console.error('Processing error:', error);
      toast({
        title: "Error",
        description: "Failed to process recording. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
      cleanup();
    }
  };

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
    cleanup();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Recording</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Recording visualization */}
          <div className="relative">
            <div 
              className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-primary hover:bg-primary/90'
              }`}
              style={{
                transform: isRecording ? `scale(${1 + (audioLevel / 255) * 0.3})` : 'scale(1)'
              }}
            >
              {isProcessing ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : isRecording ? (
                <MicOff className="h-8 w-8 text-white" />
              ) : (
                <Mic className="h-8 w-8 text-white" />
              )}
            </div>
            
            {isRecording && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-1">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status text */}
          <div className="text-center">
            {isProcessing ? (
              <p className="text-sm text-muted-foreground">Processing audio...</p>
            ) : isRecording ? (
              <p className="text-sm text-muted-foreground">Recording... Click to stop</p>
            ) : (
              <p className="text-sm text-muted-foreground">Click to start recording</p>
            )}
          </div>

          {/* Controls */}
          <div className="flex space-x-4">
            {!isRecording && !isProcessing && (
              <Button onClick={startRecording} className="px-8">
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            )}
            
            {isRecording && (
              <Button onClick={stopRecording} variant="destructive" className="px-8">
                <MicOff className="h-4 w-4 mr-2" />
                Stop Recording
              </Button>
            )}
            
            <Button onClick={handleClose} variant="outline" disabled={isProcessing}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}