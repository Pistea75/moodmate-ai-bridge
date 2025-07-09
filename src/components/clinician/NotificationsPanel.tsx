
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Calendar,
  MessageSquare,
  X
} from "lucide-react";
import { useState } from "react";

interface Notification {
  id: string;
  type: 'session' | 'task' | 'alert' | 'message';
  title: string;
  description: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'session',
    title: 'Upcoming Session',
    description: 'Session with Sarah Johnson in 30 minutes',
    time: '2 min ago',
    priority: 'high',
    isRead: false,
  },
  {
    id: '2',
    type: 'alert',
    title: 'Low Mood Alert',
    description: 'Patient Michael Brown reported mood score of 3/10',
    time: '1 hour ago',
    priority: 'high',
    isRead: false,
  },
  {
    id: '3',
    type: 'task',
    title: 'Task Completed',
    description: 'Emma Davis completed her daily reflection exercise',
    time: '3 hours ago',
    priority: 'medium',
    isRead: true,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    description: 'Patient Alex Wilson sent a message via AI chat',
    time: '5 hours ago',
    priority: 'medium',
    isRead: false,
  },
];

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'session': return Calendar;
      case 'task': return CheckCircle;
      case 'alert': return AlertTriangle;
      case 'message': return MessageSquare;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const dismissNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all read
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Icon = getIcon(notification.type);
              return (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                        <div 
                          className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`} 
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notification.id);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
