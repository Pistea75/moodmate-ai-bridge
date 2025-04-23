
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function ClinicianSettings() {
  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        
        <div className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Practice Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Online Booking</div>
                  <div className="text-sm text-muted-foreground">
                    Allow patients to book sessions online
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">Automatic Reminders</div>
                  <div className="text-sm text-muted-foreground">
                    Send automated session reminders to patients
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Working Hours</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <input
                    type="time"
                    value="09:00"
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="time"
                    value="17:00"
                    className="px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Working Days</label>
                <div className="grid grid-cols-7 gap-2 mt-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day) => (
                    <Button
                      key={day}
                      variant={day !== 'S' ? "default" : "outline"}
                      className="h-10 w-10"
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AI Assistant Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Report Generation</div>
                  <div className="text-sm text-muted-foreground">
                    Automatically generate session reports using AI
                  </div>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="font-medium">AI Chat Analysis</div>
                  <div className="text-sm text-muted-foreground">
                    Analyze patient chat interactions for insights
                  </div>
                </div>
                <Switch />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
