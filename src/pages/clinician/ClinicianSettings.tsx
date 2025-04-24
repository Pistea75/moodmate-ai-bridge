
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX, Headphones } from "lucide-react";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function ClinicianSettings() {
  const { toast } = useToast();
  const [voiceType, setVoiceType] = useState("neutral");
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [voiceTestPlaying, setVoiceTestPlaying] = useState(false);
  
  const voices = [
    { id: "aria", name: "Aria (Female)", gender: "female" },
    { id: "sarah", name: "Sarah (Female)", gender: "female" },
    { id: "roger", name: "Roger (Male)", gender: "male" },
    { id: "george", name: "George (Male)", gender: "male" },
    { id: "charlie", name: "Charlie (Neutral)", gender: "neutral" }
  ];

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
    toast({
      title: "Voice Updated",
      description: `AI voice has been updated to ${voices.find(v => v.id === value)?.name}.`,
    });
  };

  const handleTestVoice = () => {
    setVoiceTestPlaying(true);
    
    // In a real implementation, this would play the selected voice
    toast({
      title: "Testing Voice",
      description: "Playing sample with the selected voice...",
    });
    
    // Simulate voice playback ending after 3 seconds
    setTimeout(() => {
      setVoiceTestPlaying(false);
    }, 3000);
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Voice Personalization</CardTitle>
              <CardDescription>
                Customize the AI voice that patients will hear during interactions with the AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Enable AI Voice</Label>
                  <p className="text-sm text-muted-foreground">
                    Toggle AI voice on or off for patient interactions
                  </p>
                </div>
                <Switch
                  checked={audioEnabled}
                  onCheckedChange={setAudioEnabled}
                />
              </div>
              
              {audioEnabled && (
                <>
                  <div className="border-t pt-6">
                    <Label htmlFor="voice-type">Voice Type</Label>
                    <RadioGroup
                      id="voice-type"
                      value={voiceType}
                      onValueChange={setVoiceType}
                      className="grid grid-cols-3 gap-4 mt-2"
                    >
                      <div>
                        <RadioGroupItem 
                          value="female" 
                          id="female" 
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="female"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Female</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="male" 
                          id="male" 
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="male"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Male</span>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="neutral" 
                          id="neutral" 
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="neutral"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                          <span>Neutral</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="voice-selection">Select Voice</Label>
                    <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices
                          .filter(voice => voiceType === 'neutral' || voice.gender === voiceType)
                          .map((voice) => (
                            <SelectItem key={voice.id} value={voice.id}>
                              {voice.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleTestVoice} 
                    variant="outline" 
                    className="w-full flex gap-2"
                    disabled={voiceTestPlaying}
                  >
                    {voiceTestPlaying ? (
                      <>
                        <VolumeX className="h-4 w-4" />
                        <span className="animate-pulse">Playing sample...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" />
                        <span>Test Voice</span>
                      </>
                    )}
                  </Button>
                  
                  <div className="bg-muted/50 p-3 rounded-md text-sm flex gap-2 items-start">
                    <Headphones className="h-5 w-5 text-mood-purple flex-shrink-0 mt-0.5" />
                    <p>
                      Your selected AI voice will be used when patients interact with the AI assistant. 
                      They'll hear this voice during AI chat interactions and when listening to AI-generated summaries.
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
