import { useState, useEffect } from 'react';

export interface VoiceSettings {
  autoplay: boolean;
  sttLanguage: string;
  ttsLanguage: string;
  ttsVoice: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: VoiceSettings = {
  autoplay: true,
  sttLanguage: 'es-ES',
  ttsLanguage: 'es',
  ttsVoice: 'alloy',
  enabled: false
};

const STORAGE_KEY = 'voice_settings';

export function useVoiceSettings() {
  const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Load settings from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Error parsing voice settings:', error);
      }
    }
  }, []);

  const updateSettings = (updates: Partial<VoiceSettings>) => {
    const newSettings = { ...settings, ...updates };
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    settings,
    updateSettings,
    resetSettings
  };
}

export const SUPPORTED_STT_LANGUAGES = [
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'es-AR', name: 'Español (Argentina)' },
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' }
];

export const SUPPORTED_TTS_VOICES = [
  { id: 'alloy', name: 'Alloy', language: 'Neutral' },
  { id: 'echo', name: 'Echo', language: 'Neutral' },
  { id: 'fable', name: 'Fable', language: 'Neutral' },
  { id: 'onyx', name: 'Onyx', language: 'Neutral' },
  { id: 'nova', name: 'Nova', language: 'Neutral' },
  { id: 'shimmer', name: 'Shimmer', language: 'Neutral' }
];