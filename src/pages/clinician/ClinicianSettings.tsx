import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, Bell, Moon, Palette } from "lucide-react";
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from '@/providers/ThemeProvider';
import { useAuth } from '@/hooks/use-auth';

export default function ClinicianSettings() {
  const { toast } = useToast();
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [selectedVoice, setSelectedVoice] = useState("aria");
  const clinicianName = "Dr. Sarah Johnson"; // This would come from your auth context
  const { user } = useAuth();

  const voices = [
    { id: "aria", name: "Aria (Female)" },
    { id: "roger", name: "Roger (Male)" },
    { id: "sarah", name: "Sarah (Female)" },
    { id: "george", name: "George (Male)" },
    { id: "charlie", name: "Charlie (Neutral)" },
    { id: "custom", name: "Custom Voice" }
  ];

  const themeColors = [
    { id: "purple", name: "Soft Purple", class: "bg-[#E5DEFF]" },
    { id: "green", name: "Soft Green", class: "bg-[#F2FCE2]" },
    { id: "peach", name: "Soft Peach", class: "bg-[#FDE1D3]" },
    { id: "blue", name: "Soft Blue", class: "bg-[#D3E4FD]" }
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
            <h2 className="text-lg font-semibold mb-4">Your Referral Code</h2>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Share this code with your patients to connect with them on MoodMate.
              </p>
              <div className="flex items-center gap-2">
                <div className="font-mono text-xl bg-muted p-3 rounded-md">
                  {user?.user_metadata?.referral_code}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Appearance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Dark Mode</div>
                  <div className="text-sm text-muted-foreground">
                    Toggle dark mode theme
                  </div>
                </div>
                <Switch 
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
              <div className="space-y-3">
                <div className="space-y-0.5">
                  <div className="font-medium">Theme Color</div>
                  <div className="text-sm text-muted-foreground">
                    Choose your preferred theme color
                  </div>
                </div>
                <div className="flex gap-2">
                  {themeColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id as any)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        themeColor === color.id ? 'ring-2 ring-offset-2 ring-mood-purple' : ''
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
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
            <h2 className="text-lg font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Session Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications about upcoming sessions
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Patient Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about patient activity
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
