
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Bell, Moon, User } from "lucide-react";

export default function PatientSettings() {
  return (
    <PatientLayout>
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
                  <div className="font-medium">Task Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Get notified about pending tasks
                  </div>
                </div>
                <Switch />
              </div>
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
    </PatientLayout>
  );
}
