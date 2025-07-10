
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Clock, Mail, MessageSquare, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

      // Create a test notification
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

  const getTimingLabel = (timing: string) => {
    switch (timing) {
      case '24h': return '24 hours before';
      case '2h': return '2 hours before';
      case '30m': return '30 minutes before';
      default: return timing;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'push': return <Bell className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
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
        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Reminder Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reminderSettings.map((setting) => (
              <div key={setting.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(setting.type)}
                    <span className="font-medium capitalize">{setting.type} Reminder</span>
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => toggleReminder(setting.id)}
                  />
                </div>
                
                {setting.enabled && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={setting.type} onValueChange={(value: 'email' | 'sms' | 'push') => updateReminderType(setting.id, value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="push">Push Notification</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={setting.timing} onValueChange={(value: '24h' | '2h' | '30m') => updateReminderTiming(setting.id, value)}>
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
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingSessions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No upcoming sessions in the next 7 days
                </div>
              ) : (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{session.patient_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(session.scheduled_time).toLocaleDateString()} at{' '}
                        {new Date(session.scheduled_time).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">{session.session_type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.reminder_sent && (
                        <Badge variant="secondary">Reminder Sent</Badge>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => sendTestReminder(session.id)}
                        disabled={loading}
                      >
                        Test Reminder
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
