import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useVoiceSettings, SUPPORTED_STT_LANGUAGES, SUPPORTED_TTS_VOICES } from '@/hooks/useVoiceSettings';
import { useVoiceConsent } from '@/hooks/useVoiceConsent';
import { VoiceConsentModal } from './VoiceConsentModal';
import { Separator } from '@/components/ui/separator';
import { Mic, Volume2, RefreshCw } from 'lucide-react';

export function VoiceSettings() {
  const { settings, updateSettings, resetSettings } = useVoiceSettings();
  const { hasConsent, revokeConsent } = useVoiceConsent();
  const [showConsentModal, setShowConsentModal] = React.useState(false);

  const handleConsentRevoke = async () => {
    try {
      await revokeConsent();
      updateSettings({ enabled: false });
    } catch (error) {
      console.error('Failed to revoke consent:', error);
    }
  };

  const handleEnableVoice = () => {
    if (!hasConsent) {
      setShowConsentModal(true);
    } else {
      updateSettings({ enabled: !settings.enabled });
    }
  };

  const handleConsentGiven = () => {
    updateSettings({ enabled: true });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="w-5 h-5" />
            Voice Chat Settings
          </CardTitle>
          <CardDescription>
            Configure voice input and output preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Enable/Disable */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="voice-enabled">Enable Voice Chat</Label>
              <p className="text-sm text-muted-foreground">
                Allow voice input and audio responses
              </p>
            </div>
            <Switch
              id="voice-enabled"
              checked={settings.enabled && hasConsent}
              onCheckedChange={handleEnableVoice}
            />
          </div>

          {settings.enabled && hasConsent && (
            <>
              <Separator />
              
              {/* Autoplay Setting */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoplay">Auto-play Responses</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically play AI audio responses
                  </p>
                </div>
                <Switch
                  id="autoplay"
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => updateSettings({ autoplay: checked })}
                />
              </div>

              <Separator />

              {/* Speech-to-Text Language */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Speech Recognition Language
                </Label>
                <Select
                  value={settings.sttLanguage}
                  onValueChange={(value) => updateSettings({ sttLanguage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_STT_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Text-to-Speech Voice */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  AI Voice
                </Label>
                <Select
                  value={settings.ttsVoice}
                  onValueChange={(value) => updateSettings({ ttsVoice: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUPPORTED_TTS_VOICES.map((voice) => (
                      <SelectItem key={voice.id} value={voice.id}>
                        {voice.name} ({voice.language})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              {/* Privacy Controls */}
              <div className="space-y-4">
                <Label>Privacy Controls</Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleConsentRevoke}
                  >
                    Revoke Voice Consent
                  </Button>
                  <Button
                    variant="outline" 
                    size="sm"
                    onClick={resetSettings}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Settings
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <VoiceConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onConsent={handleConsentGiven}
      />
    </>
  );
}