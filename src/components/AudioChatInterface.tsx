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
}

export function AudioChatInterface({ isClinicianView = false, selectedPatientId }: AudioChatInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const {
    messages,
    isLoading,
    sendMessage,
    sendAudioMessage,
    playAudioResponse
  } = useAudioChat(selectedPatientId);

  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  const handleSendAudio = async (audioBlob: Blob) => {
    await sendAudioMessage(audioBlob);
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

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">
          {isClinicianView ? 'AI Training Chat' : 'AI Mental Health Assistant'}
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
        <MessageList messages={messages} isLoading={isLoading} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        {inputMode === 'text' ? (
          <TextInputMode
            onSendMessage={handleSendMessage}
            disabled={isLoading}
          />
        ) : (
          <VoiceInputMode
            isRecording={isRecording}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            disabled={isLoading}
          />
        )}
      </div>
    </Card>
  );
}
