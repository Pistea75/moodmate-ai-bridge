
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Palette } from "lucide-react";
import { useTheme } from '@/providers/ThemeProvider';

export default function ClinicianSettings() {
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();

  const themeColors = [
    { id: "purple", name: "Purple Theme", class: "bg-[hsl(252,100%,95%)]" },
    { id: "green", name: "Green Theme", class: "bg-[hsl(142,76%,95%)]" },
    { id: "peach", name: "Peach Theme", class: "bg-[hsl(22,100%,95%)]" },
    { id: "blue", name: "Blue Theme", class: "bg-[hsl(212,100%,95%)]" }
  ];

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Palette className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Appearance</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <div className="font-medium">Dark Mode</div>
                  </div>
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
                <div className="flex gap-3">
                  {themeColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id as any)}
                      className={`w-10 h-10 rounded-full ${color.class} ${
                        themeColor === color.id 
                          ? 'ring-2 ring-offset-2 ring-primary' 
                          : ''
                      } transition-all hover:scale-110`}
                      title={color.name}
                      aria-label={color.name}
                    />
                  ))}
                </div>
              </div>
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
