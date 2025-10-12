import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export interface VoiceCustomizationSettings {
  voice: string;
  customInstructions: string;
}

interface VoiceCustomizationProps {
  settings: VoiceCustomizationSettings;
  onSettingsChange: (settings: VoiceCustomizationSettings) => void;
}

const VOICE_PRESETS = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral y versátil' },
  { id: 'echo', name: 'Echo', description: 'Cálido y amigable' },
  { id: 'fable', name: 'Fable', description: 'Narrativo y expresivo' },
  { id: 'onyx', name: 'Onyx', description: 'Profundo y autoritario' },
  { id: 'nova', name: 'Nova', description: 'Energético y juvenil' },
  { id: 'shimmer', name: 'Shimmer', description: 'Suave y tranquilizador' }
];

export function VoiceCustomization({ settings, onSettingsChange }: VoiceCustomizationProps) {
  const { toast } = useToast();
  const [localSettings, setLocalSettings] = useState<VoiceCustomizationSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleVoiceChange = (voice: string) => {
    setLocalSettings({ ...localSettings, voice });
    setHasChanges(true);
  };

  const handleInstructionsChange = (customInstructions: string) => {
    setLocalSettings({ ...localSettings, customInstructions });
    setHasChanges(true);
  };

  const handleSave = () => {
    onSettingsChange(localSettings);
    setHasChanges(false);
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias de voz han sido actualizadas.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalización de Voz</CardTitle>
        <CardDescription>
          Personaliza la voz y el comportamiento del asistente de IA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voice Selection */}
        <div className="space-y-2">
          <Label htmlFor="voice-select">Voz del Asistente</Label>
          <Select value={localSettings.voice} onValueChange={handleVoiceChange}>
            <SelectTrigger id="voice-select">
              <SelectValue placeholder="Selecciona una voz" />
            </SelectTrigger>
            <SelectContent>
              {VOICE_PRESETS.map((preset) => (
                <SelectItem key={preset.id} value={preset.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{preset.name}</span>
                    <span className="text-xs text-muted-foreground">{preset.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Custom Instructions */}
        <div className="space-y-2">
          <Label htmlFor="custom-instructions">Instrucciones Personalizadas</Label>
          <Textarea
            id="custom-instructions"
            placeholder="Ej: Habla con acento mexicano, usa un tono más formal, enfócate en..."
            value={localSettings.customInstructions}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Agrega instrucciones adicionales como cambios de acento, tono, o enfoque específico.
            Estas instrucciones se combinarán con las instrucciones base del sistema.
          </p>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
          >
            Guardar Cambios
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
