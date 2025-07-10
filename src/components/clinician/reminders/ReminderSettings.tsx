
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageSquare, Bell } from 'lucide-react';

interface ReminderSettings {
  id: string;
  enabled: boolean;
  type: 'email' | 'sms' | 'push';
  timing: '24h' | '2h' | '30m';
  message: string;
}

interface ReminderSettingsProps {
  settings: ReminderSettings[];
  onToggle: (id: string) => void;
  onUpdateType: (id: string, type: 'email' | 'sms' | 'push') => void;
  onUpdateTiming: (id: string, timing: '24h' | '2h' | '30m') => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'email': return <Mail className="h-4 w-4" />;
    case 'sms': return <MessageSquare className="h-4 w-4" />;
    case 'push': return <Bell className="h-4 w-4" />;
    default: return <Bell className="h-4 w-4" />;
  }
};

export function ReminderSettingsComponent({ settings, onToggle, onUpdateType, onUpdateTiming }: ReminderSettingsProps) {
  return (
    <div className="space-y-4">
      {settings.map((setting) => (
        <div key={setting.id} className="p-4 border rounded-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getTypeIcon(setting.type)}
              <span className="font-medium capitalize">{setting.type} Reminder</span>
            </div>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => onToggle(setting.id)}
            />
          </div>
          
          {setting.enabled && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <Select value={setting.type} onValueChange={(value: 'email' | 'sms' | 'push') => onUpdateType(setting.id, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="push">Push Notification</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={setting.timing} onValueChange={(value: '24h' | '2h' | '30m') => onUpdateTiming(setting.id, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">24 hours before</SelectItem>
                    <SelectItem value="2h">2 hours before</SelectItem>
                    <SelectItem value="30m">30 minutes before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted p-2 rounded">
                {setting.message}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
