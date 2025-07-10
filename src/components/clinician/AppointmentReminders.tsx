
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Clock, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReminderSettingsComponent } from './reminders/ReminderSettings';
import { UpcomingSessionsList } from './reminders/UpcomingSessionsList';

interface ReminderSettings {
  id: string;
  enabled: boolean;
  type: 'email' | 'sms' | 'push';
  timing: '24h' | '2h' | '30m';
  message: string;
}

interface UpcomingSession {
  id: string;
  patient_name: string;
  scheduled_time: string;
  session_type: string;
  reminder_sent: boolean;
}

export function AppointmentReminders() {
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings[]>([
    {
      id: '1',
      enabled: true,
      type: 'email',
      timing: '24h',
      message: 'Reminder: You have an appointment tomorrow at {time} with Dr. {clinician}'
    },
    {
      id: '2',
      enabled: true,
      type: 'sms',
      timing: '2h',
      message: 'Appointment reminder: Your session starts in 2 hours'
    },
    {
      id: '3',
      enabled: false,
      type: 'push',
      timing: '30m',
      message: 'Your appointment is starting in 30 minutes'
    }
  ]);

  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUpcomingSessions();
  }, []);

  const fetchUpcomingSessions = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data: sessions } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          session_type,
          reminder_sent_at,
          profiles!sessions_patient_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('clinician_id', user.user.id)
        .gte('scheduled_time', new Date().toISOString())
        .lte('scheduled_time', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('scheduled_time');

      const sessionData = sessions?.map(session => ({
        id: session.id,
        patient_name: session.profiles ? 
          `${session.profiles.first_name} ${session.profiles.last_name}` : 
          'Unknown Patient',
        scheduled_time: session.scheduled_time,
        session_type: session.session_type || 'Therapy Session',
        reminder_sent: !!session.reminder_sent_at
      })) || [];

      setUpcomingSessions(sessionData);
    } catch (error) {
      console.error('Error fetching upcoming sessions:', error);
    }
  };

  const toggleReminder = (id: string) => {
    setReminderSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
    ));
  };

  const updateReminderType = (id: string, type: 'email' | 'sms' | 'push') => {
    setReminderSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, type } : setting
    ));
  };

  const updateReminderTiming = (id: string, timing: '24h' | '2h' | '30m') => {
    setReminderSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, timing } : setting
    ));
  };

  const sendTestReminder = async (sessionId: string) => {
    setLoading(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const session = upcomingSessions.find(s => s.id === sessionId);
      if (!session) return;

      await supabase
        .from('notifications')
        .insert({
          user_id: user.user.id,
          type: 'session_reminder',
          title: 'Test Appointment Reminder',
          description: `Test reminder for ${session.patient_name}'s appointment on ${new Date(session.scheduled_time).toLocaleDateString()}`,
          priority: 'medium',
          metadata: {
            session_id: sessionId,
            test_reminder: true
          }
        });

      toast.success('Test reminder sent successfully');
    } catch (error) {
      console.error('Error sending test reminder:', error);
      toast.error('Failed to send test reminder');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-7 w-7 text-blue-600" />
            Appointment Reminders
          </h2>
          <p className="text-muted-foreground">Automated reminders for upcoming sessions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reminder Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReminderSettingsComponent 
              settings={reminderSettings}
              onToggle={toggleReminder}
              onUpdateType={updateReminderType}
              onUpdateTiming={updateReminderTiming}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingSessionsList 
              sessions={upcomingSessions}
              onSendTestReminder={sendTestReminder}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
