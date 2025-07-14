
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface DashboardStats {
  tasksCompleted: number;
  totalTasks: number;
  weeklyGoalProgress: number;
  currentStreak: number;
  longestStreak: number;
  recentMoodAverage: number;
  upcomingSessions: number;
}

export function usePatientDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    tasksCompleted: 0,
    totalTasks: 0,
    weeklyGoalProgress: 0,
    currentStreak: 0,
    longestStreak: 0,
    recentMoodAverage: 0,
    upcomingSessions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch tasks stats
        const { data: tasks, error: tasksError } = await supabase
          .from('tasks')
          .select('completed, due_date')
          .eq('patient_id', user.id);

        if (tasksError) throw tasksError;

        const completedTasks = tasks?.filter(t => t.completed).length || 0;
        const totalTasks = tasks?.length || 0;

        // Fetch recent mood entries
        const { data: moodEntries, error: moodError } = await supabase
          .from('mood_entries')
          .select('mood_score, created_at')
          .eq('patient_id', user.id)
          .gte('created_at', weekAgo.toISOString())
          .order('created_at', { ascending: false });

        if (moodError) throw moodError;

        const recentMoodAverage = moodEntries?.length 
          ? moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length
          : 0;

        // Calculate mood streak (days with mood entries > 6)
        const sortedEntries = moodEntries?.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) || [];

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (const entry of sortedEntries) {
          if (entry.mood_score >= 6) {
            tempStreak++;
            if (currentStreak === 0) currentStreak = tempStreak;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
            if (currentStreak > 0) break;
          }
        }
        longestStreak = Math.max(longestStreak, tempStreak);

        // Fetch upcoming sessions
        const { data: sessions, error: sessionsError } = await supabase
          .from('sessions')
          .select('scheduled_time')
          .eq('patient_id', user.id)
          .gte('scheduled_time', now.toISOString())
          .eq('attendance_status', 'scheduled');

        if (sessionsError) throw sessionsError;

        const upcomingSessions = sessions?.length || 0;

        setStats({
          tasksCompleted: completedTasks,
          totalTasks,
          weeklyGoalProgress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0,
          currentStreak,
          longestStreak,
          recentMoodAverage,
          upcomingSessions,
        });
      } catch (err: any) {
        console.error('Error fetching dashboard stats:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [user]);

  return { stats, loading, error };
}
