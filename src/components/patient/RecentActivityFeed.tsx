import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, MessageSquare, Heart, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ActivityItem {
  id: string;
  type: 'mood' | 'task' | 'chat' | 'session';
  title: string;
  description: string;
  timestamp: string;
  status?: 'completed' | 'pending' | 'scheduled';
}

export function RecentActivityFeed() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchRecentActivity();
    }
  }, [user?.id]);

  const fetchRecentActivity = async () => {
    if (!user?.id) return;
    
    try {
      const activities: ActivityItem[] = [];
      
      // Fetch recent mood entries
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      moodEntries?.forEach(entry => {
        activities.push({
          id: `mood-${entry.id}`,
          type: 'mood',
          title: `Mood logged: ${entry.mood_score}/10`,
          description: entry.notes || 'No notes added',
          timestamp: entry.created_at,
          status: 'completed'
        });
      });

      // Fetch recent tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('patient_id', user.id)
        .order('inserted_at', { ascending: false })
        .limit(3);

      tasks?.forEach(task => {
        activities.push({
          id: `task-${task.id}`,
          type: 'task',
          title: task.completed ? `Completed: ${task.title}` : `Task: ${task.title}`,
          description: task.description || 'No description',
          timestamp: task.completed ? task.inserted_at : task.inserted_at,
          status: task.completed ? 'completed' : 'pending'
        });
      });

      // Fetch recent AI chat activity
      const { data: chatLogs } = await supabase
        .from('ai_chat_logs')
        .select('*')
        .eq('patient_id', user.id)
        .eq('role', 'user')
        .order('created_at', { ascending: false })
        .limit(2);

      chatLogs?.forEach(chat => {
        activities.push({
          id: `chat-${chat.id}`,
          type: 'chat',
          title: 'AI Chat Session',
          description: chat.message.length > 50 ? chat.message.substring(0, 50) + '...' : chat.message,
          timestamp: chat.created_at,
          status: 'completed'
        });
      });

      // Fetch upcoming sessions
      const { data: sessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('patient_id', user.id)
        .gte('scheduled_time', new Date().toISOString())
        .order('scheduled_time', { ascending: true })
        .limit(2);

      sessions?.forEach(session => {
        activities.push({
          id: `session-${session.id}`,
          type: 'session',
          title: 'Upcoming Session',
          description: `${session.duration_minutes} min session`,
          timestamp: session.scheduled_time,
          status: 'scheduled'
        });
      });

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setActivities(activities.slice(0, 6));
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'mood': return <Heart className="h-4 w-4 text-pink-600" />;
      case 'task': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'chat': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'session': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'scheduled':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm truncate">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-gray-600 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-xs">Start by logging your mood or completing a task</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
