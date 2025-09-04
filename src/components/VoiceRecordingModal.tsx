import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useHybridSTT } from '@/hooks/useHybridSTT';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';

interface VoiceRecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscription: (text: string) => void;
}

export function VoiceRecordingModal({ isOpen, onClose, onTranscription }: VoiceRecordingModalProps) {
  const { toast } = useToast();
  const { settings } = useVoiceSettings();

  const handleTranscription = (text: string) => {
    onTranscription(text);
    onClose();
    toast({
      title: "Success",
      description: "Audio transcribed successfully!",
    });
  };

  const handleError = (error: string) => {
    toast({
      title: "Error",
      description: error,
      variant: "destructive",
    });
  };

  const {
    isRecording,
    isProcessing,
    startRecording,
    stopRecording,
    isWebSpeechSupported
  } = useHybridSTT({
    language: settings.sttLanguage,
    onTranscription: handleTranscription,
    onError: handleError
  });

  const handleClose = () => {
    if (isRecording) {
      stopRecording();
    }
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