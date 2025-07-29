
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, MessageSquare, Calendar, AlertTriangle, CheckCircle, X, Check } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useNotificationService } from '@/hooks/useNotificationService';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'alert':
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    case 'session':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'message':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'task':
      return <CheckCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'default';
    case 'low':
      return 'secondary';
    default:
      return 'default';
  }
};

export function NotificationsPanel() {
  const { notifications, loading, unreadCount, markAsRead, markAllAsRead, dismissNotification } = useNotifications();
  const { createTestNotifications } = useNotificationService();

  if (loading) {
    return <div className="text-center py-8">Loading notifications...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={createTestNotifications}
            size="sm"
          >
            Create Test Notifications
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={markAllAsRead}
              size="sm"
            >
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <Card>
        <ScrollArea className="h-[500px]">
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No notifications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
                      notification.is_read 
                        ? 'bg-background' 
                        : 'bg-muted/50 border-primary/20'
                    }`}
                  >
                    {getNotificationIcon(notification.type)}
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium ${!notification.is_read ? 'font-semibold' : ''}`}>
                          {notification.title}
                        </h3>
                        <Badge variant={getPriorityColor(notification.priority)} size="sm">
                          {notification.priority}
                        </Badge>
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">
                        {notification.description}
                      </p>
                      
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
