
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Palette } from "lucide-react";
import { useTheme } from '@/providers/ThemeProvider';

export default function ClinicianSettings() {
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();

  const themeColors = [
    { id: "purple", name: "Soft Purple", class: "bg-[#E5DEFF]" },
    { id: "green", name: "Soft Green", class: "bg-[#F2FCE2]" },
    { id: "peach", name: "Soft Peach", class: "bg-[#FDE1D3]" },
    { id: "blue", name: "Soft Blue", class: "bg-[#D3E4FD]" }
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
                <div className="flex gap-2">
                  {themeColors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setThemeColor(color.id as any)}
                      className={`w-8 h-8 rounded-full ${color.class} ${
                        themeColor === color.id ? 'ring-2 ring-offset-2 ring-primary' : ''
                      } transition-all hover:scale-110`}
                      title={color.name}
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
