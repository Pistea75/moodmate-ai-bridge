
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useNotificationService() {
  const { toast } = useToast();

  const createNotification = async (
    type: 'session' | 'task' | 'alert' | 'message' | 'system',
    title: string,
    description: string,
    priority: 'low' | 'medium' | 'high' = 'medium',
    metadata: any = {}
  ) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.user.id,
          type,
          title,
          description,
          priority,
          metadata,
        });

      if (error) throw error;

      console.log('Notification created successfully');
    } catch (err: any) {
      console.error('Error creating notification:', err);
      toast({
        variant: "destructive",
        title: "Failed to create notification",
        description: err.message,
      });
    }
  };

  const createAIChatNotification = async (patientId: string, messageCount: number) => {
    try {
      // Get patient name
      const { data: patient } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', patientId)
        .single();

      const patientName = patient 
        ? `${patient.first_name} ${patient.last_name}` 
        : 'Unknown Patient';

      await createNotification(
        'message',
        'New AI Chat Messages',
        `${patientName} has ${messageCount} new message(s) in AI chat`,
        'medium',
        {
          patient_id: patientId,
          patient_name: patientName,
          message_count: messageCount
        }
      );
    } catch (err: any) {
      console.error('Error creating AI chat notification:', err);
    }
  };

  const createTestNotifications = async () => {
    const testNotifications = [
      {
        type: 'alert' as const,
        title: 'Low Mood Alert',
        description: 'Patient John Doe reported mood score of 2/10',
        priority: 'high' as const,
        metadata: { patient_id: 'test', mood_score: 2 }
      },
      {
        type: 'session' as const,
        title: 'Upcoming Session',
        description: 'Session with Sarah Johnson in 30 minutes',
        priority: 'high' as const,
        metadata: { session_id: 'test', patient_name: 'Sarah Johnson' }
      },
      {
        type: 'task' as const,
        title: 'Task Completed',
        description: 'Emma Davis completed her daily reflection exercise',
        priority: 'medium' as const,
        metadata: { task_id: 'test', patient_name: 'Emma Davis' }
      },
      {
        type: 'message' as const,
        title: 'New Message',
        description: 'Patient Alex Wilson sent a message via AI chat',
        priority: 'medium' as const,
        metadata: { patient_id: 'test', patient_name: 'Alex Wilson' }
      }
    ];

    for (const notification of testNotifications) {
      await createNotification(
        notification.type,
        notification.title,
        notification.description,
        notification.priority,
        notification.metadata
      );
      // Small delay between notifications
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    toast({
      title: "Test notifications created",
      description: "Check your notifications panel to see them",
    });
  };

  return {
    createNotification,
    createAIChatNotification,
    createTestNotifications
  };
}
