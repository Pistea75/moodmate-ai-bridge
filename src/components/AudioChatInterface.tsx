import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, Volume2, VolumeX, Settings, Play, Pause } from 'lucide-react';
import { useAudioChat } from '@/hooks/useAudioChat';
import { useTTS } from '@/hooks/useTTS';
import { useVoiceSettings } from '@/hooks/useVoiceSettings';
import { useVoiceConsent } from '@/hooks/useVoiceConsent';
import { TextInputMode } from './chat/TextInputMode';
import { VoiceInputMode } from './chat/VoiceInputMode';
import { VoiceConsentModal } from './voice/VoiceConsentModal';
import { VoiceSettings } from './voice/VoiceSettings';
import { FeatureGate } from './common/FeatureGate';
import { TTSQuotaModal } from './TTSQuotaModal';

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
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');
  const [showSettings, setShowSettings] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);

  const { settings, updateSettings } = useVoiceSettings();
  const { hasConsent } = useVoiceConsent();

  const {
    messages,
    isLoading,
    isFetchingHistory,
    handleSendMessage
  } = useAudioChat(systemPrompt, selectedPatientId || patientId, isClinicianView);

  const [ttsError, setTtsError] = useState<string | null>(null);
  const [errorShown, setErrorShown] = useState(false);
  const { playText, isPlaying: isTTSPlaying } = useTTS({
    onAudioStart: () => setCurrentPlayingId('tts-active'),
    onAudioEnd: () => setCurrentPlayingId(null),
    onError: (error: string) => {
      console.error('TTS Error:', error);
      setTtsError(error);
      setCurrentPlayingId(null);
    },
    onQuotaError: () => {
      console.log('TTS quota error - showing modal');
      setCurrentPlayingId(null);
      setShowQuotaModal(true);
      updateSettings({ autoplay: false });
    }
  });

  // Autoplay de respuestas de la IA (disabled if TTS has errors)
  useEffect(() => {
    if (!settings.enabled || !settings.autoplay || messages.length === 0 || ttsError) return;

    const last = messages[messages.length - 1];
    if (last.type === 'assistant' && last.content && !isTTSPlaying) {
      playText(last.content);
    }
  }, [messages, settings.autoplay, settings.enabled, playText, isTTSPlaying, ttsError]);

  const handleToggleVoiceMode = () => {
    const goingToVoice = inputMode === 'text';
    if (goingToVoice && !hasConsent) {
      setShowConsentModal(true);
      return;
    }
    setInputMode(goingToVoice ? 'voice' : 'text');
  };

  const handleConsentGiven = () => {
    updateSettings({ enabled: true });
    setShowConsentModal(false);
    setInputMode('voice');
  };

  const playMessage = async (messageId: string, text: string) => {
    if (currentPlayingId === messageId) {
      setCurrentPlayingId(null);
      return;
    }
    
    // Clear previous TTS errors when manually trying to play
    setTtsError(null);
    setCurrentPlayingId(messageId);
    await playText(text);
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
          <FeatureGate capability="voiceChat">
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleVoiceMode}
            >
              {inputMode === 'text' ? <Mic className="h-4 w-4" /> : 'Text'}
            </Button>
          </FeatureGate>
          <FeatureGate capability="voiceChat">
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateSettings({ autoplay: !settings.autoplay })}
              disabled={!settings.enabled}
            >
              {settings.autoplay ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </FeatureGate>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="border-b p-4">
          <VoiceSettings />
        </div>
      )}

      {/* Mensajes con controles de audio */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {message.type === 'assistant' && settings.enabled && (
                    <FeatureGate capability="voiceChat">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => playMessage(message.id, message.content)}
                        disabled={isTTSPlaying}
                      >
                        {currentPlayingId === message.id ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                      </Button>
                    </FeatureGate>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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

      <VoiceConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsentGiven}
      />
      
      <TTSQuotaModal 
        open={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
      />
    </Card>
  );
}

