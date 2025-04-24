
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Bell, Moon } from "lucide-react";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export default function ClinicianSettings() {
  const { toast } = useToast();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("aria");

  const voices = [
    { id: "aria", name: "Aria (Female)" },
    { id: "roger", name: "Roger (Male)" },
    { id: "sarah", name: "Sarah (Female)" },
    { id: "george", name: "George (Male)" },
    { id: "charlie", name: "Charlie (Neutral)" },
    { id: "custom", name: "Custom Voice" }
  ];

  const handleVoiceChange = (value: string) => {
    setSelectedVoice(value);
    toast({
      title: "Voice Updated",
      description: `AI voice has been updated to ${voices.find(v => v.id === value)?.name}.`,
    });
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Session Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about upcoming sessions
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Patient Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about patient activity
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">AI Voice Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Enable AI Voice</div>
                  <div className="text-sm text-muted-foreground">
                    Toggle AI voice on or off for patient interactions
                  </div>
                </div>
                <Switch
                  checked={audioEnabled}
                  onCheckedChange={setAudioEnabled}
                />
              </div>
              
              {audioEnabled && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">Voice Selection</div>
                    <div className="text-sm text-muted-foreground">
                      Choose the voice for your AI assistant
                    </div>
                  </div>
                  <Select value={selectedVoice} onValueChange={handleVoiceChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      {voices.map((voice) => (
                        <SelectItem key={voice.id} value={voice.id}>
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Language</div>
                  <div className="text-sm text-muted-foreground">
                    Choose your preferred language
                  </div>
                </div>
                <select className="border rounded-md px-2 py-1">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
