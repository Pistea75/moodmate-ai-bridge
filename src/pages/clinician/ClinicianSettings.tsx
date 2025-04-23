
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, User } from "lucide-react";

export default function ClinicianSettings() {
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Patient Updates</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about patient activity and updates
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Session Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Receive reminders about upcoming sessions
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Report Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified when new AI reports are generated
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Session Duration Default</div>
                  <div className="text-sm text-muted-foreground">
                    Set your default session length
                  </div>
                </div>
                <select className="border rounded-md px-2 py-1">
                  <option>30 minutes</option>
                  <option>45 minutes</option>
                  <option>50 minutes</option>
                  <option>60 minutes</option>
                </select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Chat Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Tone</div>
                  <div className="text-sm text-muted-foreground">
                    Customize the AI's communication style
                  </div>
                </div>
                <select className="border rounded-md px-2 py-1">
                  <option>Professional</option>
                  <option>Friendly</option>
                  <option>Supportive</option>
                  <option>Direct</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Visibility for Patients</div>
                  <div className="text-sm text-muted-foreground">
                    Control how much AI support your patients receive
                  </div>
                </div>
                <select className="border rounded-md px-2 py-1">
                  <option>Full Access</option>
                  <option>Limited Access</option>
                  <option>Minimal Access</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
