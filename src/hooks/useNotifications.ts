
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'session' | 'task' | 'alert' | 'message' | 'system';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  is_read: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) {
        throw new Error('Not authenticated');
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setNotifications(data || []);
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err.message);
      toast({
        variant: "destructive",
        title: "Error loading notifications",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('id', notificationId);

      if (updateError) throw updateError;

      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );

      toast({
        title: "Notification marked as read",
        description: "Status updated successfully",
      });
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      toast({
        variant: "destructive",
        title: "Failed to update notification",
        description: err.message,
      });
    }
  }, [toast]);

  const markAllAsRead = useCallback(async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ is_read: true, updated_at: new Date().toISOString() })
        .eq('user_id', user.user.id)
        .eq('is_read', false);

      if (updateError) throw updateError;

      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );

      toast({
        title: "All notifications marked as read",
        description: "Status updated successfully",
      });
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
      toast({
        variant: "destructive",
        title: "Failed to update notifications",
        description: err.message,
      });
    }
  }, [toast]);

  const dismissNotification = useCallback(async (notificationId: string) => {
    try {
      // For now, we'll just mark as read since we don't have delete permission
      // In the future, we could add a "dismissed" flag or delete permission
      await markAsRead(notificationId);
      
      // Remove from local state for UI purposes
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (err: any) {
      console.error('Error dismissing notification:', err);
    }
  }, [markAsRead]);

  // Set up real-time subscription
  useEffect(() => {
    const setupRealtime = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const channel = supabase
        .channel('notifications-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.user.id}`,
          },
          (payload) => {
            console.log('New notification received:', payload);
            const newNotification = payload.new as Notification;
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Show toast for high priority notifications
            if (newNotification.priority === 'high') {
              toast({
                title: newNotification.title,
                description: newNotification.description,
                variant: newNotification.type === 'alert' ? 'destructive' : 'default',
              });
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.user.id}`,
          },
          (payload) => {
            const updatedNotification = payload.new as Notification;
            setNotifications(prev =>
              prev.map(n =>
                n.id === updatedNotification.id ? updatedNotification : n
              )
            );
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [toast]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    refetch: fetchNotifications,
  };
}
