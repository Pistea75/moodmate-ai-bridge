
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Settings, Send } from 'lucide-react';
import { UpcomingSessionsList } from './reminders/UpcomingSessionsList';
import { ReminderSettingsComponent } from './reminders/ReminderSettings';

interface UpcomingSession {
  id: string;
  patient_name: string;
  scheduled_time: string;
  session_type: string;
  reminder_sent: boolean;
}

interface ReminderSettings {
  id: string;
  enabled: boolean;
  type: 'email' | 'sms' | 'push';
  timing: '24h' | '2h' | '30m';
  message: string;
}

export function AppointmentReminders() {
  const [sessions, setSessions] = useState<UpcomingSession[]>([]);
  const [settings, setSettings] = useState<ReminderSettings[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'sessions' | 'settings'>('sessions');

  useEffect(() => {
    // Load sample data
    setSessions([
      {
        id: '1',
        patient_name: 'John Doe',
        scheduled_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        session_type: 'Therapy Session',
        reminder_sent: false
      }
    ]);

    setSettings([
      {
        id: '1',
        enabled: true,
        type: 'email',
        timing: '24h',
        message: 'Your appointment is scheduled for tomorrow at {time}'
      }
    ]);
  }, []);

  const handleSendTestReminder = (sessionId: string) => {
    setLoading(true);
    setTimeout(() => {
      setSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, reminder_sent: true }
          : session
      ));
      setLoading(false);
    }, 1000);
  };

  const handleToggleSetting = (id: string) => {
    setSettings(prev => prev.map(setting =>
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled }
        : setting
    ));
  };

  const handleUpdateType = (id: string, type: 'email' | 'sms' | 'push') => {
    setSettings(prev => prev.map(setting =>
      setting.id === id 
        ? { ...setting, type }
        : setting
    ));
  };

  const handleUpdateTiming = (id: string, timing: '24h' | '2h' | '30m') => {
    setSettings(prev => prev.map(setting =>
      setting.id === id 
        ? { ...setting, timing }
        : setting
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-primary" />
            Appointment Reminders
          </h2>
          <p className="text-muted-foreground">Manage patient appointment reminders</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'sessions' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sessions')}
          >
            <Send className="h-4 w-4 mr-2" />
            Upcoming Sessions
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'outline'}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {activeTab === 'sessions' ? 'Upcoming Sessions' : 'Reminder Settings'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeTab === 'sessions' ? (
            <UpcomingSessionsList
              sessions={sessions}
              onSendTestReminder={handleSendTestReminder}
              loading={loading}
            />
          ) : (
            <ReminderSettingsComponent
              settings={settings}
              onToggle={handleToggleSetting}
              onUpdateType={handleUpdateType}
              onUpdateTiming={handleUpdateTiming}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
