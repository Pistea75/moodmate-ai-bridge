
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useAudioChat } from '@/hooks/useAudioChat';
import { MessageList } from './chat/MessageList';
import { TextInputMode } from './chat/TextInputMode';
import { VoiceInputMode } from './chat/VoiceInputMode';

interface AudioChatInterfaceProps {
  isClinicianView?: boolean;
  selectedPatientId?: string | null;
  clinicianName?: string;
  systemPrompt?: string;
  patientId?: string;
}

export function AudioChatInterface({ 
  isClinicianView = false, 
  selectedPatientId,
  clinicianName = 'AI Assistant',
  systemPrompt = "You are a supportive mental health assistant.",
  patientId
}: AudioChatInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    messages,
    isLoading,
    isFetchingHistory,
    handleSendMessage
  } = useAudioChat(systemPrompt, selectedPatientId || patientId);

  const handleSendAudio = async (audioBlob: Blob) => {
    // For now, we'll convert audio to text placeholder
    // In a real implementation, you'd use speech-to-text service
    await handleSendMessage("Voice message transcription would appear here");
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        handleSendAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  if (isFetchingHistory) {
    return (
      <Card className="flex items-center justify-center h-[600px] w-full max-w-4xl mx-auto">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {isClinicianView ? 'AI Training Chat' : `Chat with Dr. ${clinicianName}`}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputMode(inputMode === 'text' ? 'voice' : 'text')}
          >
            {inputMode === 'text' ? <Mic className="h-4 w-4" /> : 'Text'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAudioEnabled(!audioEnabled)}
          >
            {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} clinicianName={clinicianName} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {inputMode === 'text' ? (
          <TextInputMode
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        ) : (
          <VoiceInputMode
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </Card>
  );
}
