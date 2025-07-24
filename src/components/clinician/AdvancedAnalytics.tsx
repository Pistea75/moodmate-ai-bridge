import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Calendar, Target, Activity, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const CHART_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AdvancedAnalytics() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState({
    totalPatients: 0,
    sessionsThisMonth: 0,
    avgMoodScore: 0,
    taskCompletionRate: 0,
    moodTrends: [],
    sessionData: [],
    riskDistribution: [],
    patientEngagement: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Get patient IDs for this clinician
      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', user?.id);

      if (!patientLinks || patientLinks.length === 0) {
        setLoading(false);
        return;
      }

      const patientIds = patientLinks.map(link => link.patient_id);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

      // Fetch all analytics data in parallel
      const [
        moodEntries,
        sessions,
        tasks,
        recentMoods
      ] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('mood_score, created_at, patient_id')
          .in('patient_id', patientIds)
          .gte('created_at', thirtyDaysAgo),
        
        supabase
          .from('sessions')
          .select('scheduled_time, duration_minutes, status, patient_id')
          .eq('clinician_id', user?.id)
          .gte('scheduled_time', thirtyDaysAgo),
        
        supabase
          .from('tasks')
          .select('completed, due_date, patient_id')
          .eq('clinician_id', user?.id)
          .in('patient_id', patientIds),
        
        supabase
          .from('mood_entries')
          .select('mood_score, created_at, patient_id')
          .in('patient_id', patientIds)
          .gte('created_at', sevenDaysAgo)
          .order('created_at', { ascending: true })
      ]);

      // Calculate metrics
      const totalPatients = patientIds.length;
      const sessionsThisMonth = sessions.data?.length || 0;
      const avgMoodScore = moodEntries.data?.length > 0 
        ? moodEntries.data.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.data.length 
        : 0;
      
      const completedTasks = tasks.data?.filter(task => task.completed).length || 0;
      const totalTasks = tasks.data?.length || 0;
      const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      // Generate mood trends for the last 7 days
      const moodTrends = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const dayMoods = recentMoods.data?.filter(mood => 
          mood.created_at.startsWith(dateStr)
        ) || [];
        
        const avgMood = dayMoods.length > 0 
          ? dayMoods.reduce((sum, mood) => sum + mood.mood_score, 0) / dayMoods.length 
          : 0;

        return {
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          mood: Math.round(avgMood * 10) / 10
        };
      });

      // Generate session data for the last 4 weeks
      const sessionData = Array.from({ length: 4 }, (_, i) => {
        const weekStart = new Date(Date.now() - (3 - i) * 7 * 24 * 60 * 60 * 1000);
        const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const weekSessions = sessions.data?.filter(session => {
          const sessionDate = new Date(session.scheduled_time);
          return sessionDate >= weekStart && sessionDate < weekEnd;
        }) || [];

        return {
          week: `Week ${i + 1}`,
          sessions: weekSessions.length,
          completed: weekSessions.filter(s => s.status === 'completed').length
        };
      });

      // Risk distribution based on recent mood scores
      const lowRisk = recentMoods.data?.filter(mood => mood.mood_score >= 7).length || 0;
      const mediumRisk = recentMoods.data?.filter(mood => mood.mood_score >= 4 && mood.mood_score < 7).length || 0;
      const highRisk = recentMoods.data?.filter(mood => mood.mood_score < 4).length || 0;
      
      const riskDistribution = [
        { name: 'Low Risk', value: lowRisk, color: CHART_COLORS[1] },
        { name: 'Medium Risk', value: mediumRisk, color: CHART_COLORS[2] },
        { name: 'High Risk', value: highRisk, color: CHART_COLORS[3] }
      ].filter(item => item.value > 0);

      // Patient engagement (sessions per patient)
      const patientEngagement = patientIds.map(patientId => {
        const patientSessions = sessions.data?.filter(s => s.patient_id === patientId).length || 0;
        return {
          patient: `Patient ${patientId.slice(-4)}`,
          sessions: patientSessions
        };
      }).sort((a, b) => b.sessions - a.sessions).slice(0, 5);

      setAnalytics({
        totalPatients,
        sessionsThisMonth,
        avgMoodScore: Math.round(avgMoodScore * 10) / 10,
        taskCompletionRate: Math.round(taskCompletionRate),
        moodTrends,
        sessionData,
        riskDistribution,
        patientEngagement
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              Active patients under care
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.sessionsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Mood Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgMoodScore}</div>
            <p className="text-xs text-muted-foreground">
              Out of 10 (last 30 days)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.taskCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              All assigned tasks
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Mood Trends (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.moodTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="mood" 
                  stroke={CHART_COLORS[0]} 
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS[0] }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Session Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Session Activity (4 Weeks)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.sessionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill={CHART_COLORS[0]} name="Scheduled" />
                <Bar dataKey="completed" fill={CHART_COLORS[1]} name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Patient Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.riskDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {analytics.riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Patient Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Top Patient Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.patientEngagement} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="patient" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="sessions" fill={CHART_COLORS[4]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}