
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, Palette } from "lucide-react";
import { useTheme } from '@/providers/ThemeProvider';

export default function PatientSettings() {
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();
  const patientName = "John Smith"; // This would come from your auth context

  const themeColors = [
    { id: "purple", name: "Soft Purple", class: "bg-[#E5DEFF]" },
    { id: "green", name: "Soft Green", class: "bg-[#F2FCE2]" },
    { id: "peach", name: "Soft Peach", class: "bg-[#FDE1D3]" },
    { id: "blue", name: "Soft Blue", class: "bg-[#D3E4FD]" }
  ];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Welcome, {patientName}</h1>
        
        <div className="grid gap-6">
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
                  <div className="font-medium">Task Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about pending tasks
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
