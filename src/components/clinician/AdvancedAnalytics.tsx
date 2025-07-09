
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/ui/calendar";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, Target, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface AnalyticsData {
  moodTrends: any[];
  sessionStats: any[];
  taskCompletion: any[];
  patientEngagement: any[];
  riskDistribution: any[];
  outcomeMetrics: any[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export function AdvancedAnalytics() {
  const [data, setData] = useState<AnalyticsData>({
    moodTrends: [],
    sessionStats: [],
    taskCompletion: [],
    patientEngagement: [],
    riskDistribution: [],
    outcomeMetrics: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date()
  });

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchAnalyticsData();
    }
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const startDate = startOfDay(dateRange.from).toISOString();
      const endDate = endOfDay(dateRange.to).toISOString();

      // Get clinician's patients
      const { data: patientLinks } = await supabase
        .from('patient_clinician_links')
        .select('patient_id')
        .eq('clinician_id', user.id);

      const patientIds = patientLinks?.map(link => link.patient_id) || [];

      if (patientIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch mood trends
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at, patient_id')
        .in('patient_id', patientIds)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at');

      // Process mood trends by day
      const moodByDay = moodEntries?.reduce((acc: any, entry) => {
        const day = format(new Date(entry.created_at), 'MMM dd');
        if (!acc[day]) acc[day] = { day, scores: [], count: 0 };
        acc[day].scores.push(entry.mood_score);
        acc[day].count++;
        return acc;
      }, {}) || {};

      const moodTrends = Object.values(moodByDay).map((day: any) => ({
        day: day.day,
        averageMood: day.scores.reduce((sum: number, score: number) => sum + score, 0) / day.scores.length,
        entries: day.count
      }));

      // Fetch session statistics
      const { data: sessions } = await supabase
        .from('sessions')
        .select('scheduled_time, status, duration_minutes')
        .in('patient_id', patientIds)
        .gte('scheduled_time', startDate)
        .lte('scheduled_time', endDate);

      const sessionsByDay = sessions?.reduce((acc: any, session) => {
        const day = format(new Date(session.scheduled_time), 'MMM dd');
        if (!acc[day]) acc[day] = { day, scheduled: 0, completed: 0, cancelled: 0 };
        acc[day].scheduled++;
        if (session.status === 'completed') acc[day].completed++;
        if (session.status === 'cancelled') acc[day].cancelled++;
        return acc;
      }, {}) || {};

      const sessionStats = Object.values(sessionsByDay);

      // Fetch task completion data
      const { data: tasks } = await supabase
        .from('tasks')
        .select('completed, due_date, inserted_at')
        .in('patient_id', patientIds)
        .gte('inserted_at', startDate)
        .lte('inserted_at', endDate);

      const tasksByWeek = tasks?.reduce((acc: any, task) => {
        const week = format(new Date(task.inserted_at), "'Week of' MMM dd");
        if (!acc[week]) acc[week] = { week, total: 0, completed: 0 };
        acc[week].total++;
        if (task.completed) acc[week].completed++;
        return acc;
      }, {}) || {};

      const taskCompletion = Object.values(tasksByWeek).map((week: any) => ({
        ...week,
        completionRate: (week.completed / week.total) * 100
      }));

      // Calculate patient engagement
      const { data: chatLogs } = await supabase
        .from('ai_chat_logs')
        .select('created_at, patient_id')
        .in('patient_id', patientIds)
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      const engagementByWeek = chatLogs?.reduce((acc: any, log) => {
        const week = format(new Date(log.created_at), "'Week of' MMM dd");
        if (!acc[week]) acc[week] = { week, interactions: 0, activePatients: new Set() };
        acc[week].interactions++;
        acc[week].activePatients.add(log.patient_id);
        return acc;
      }, {}) || {};

      const patientEngagement = Object.values(engagementByWeek).map((week: any) => ({
        week: week.week,
        interactions: week.interactions,
        activePatients: week.activePatients.size
      }));

      // Risk distribution (mock data for now)
      const riskDistribution = [
        { name: 'Low Risk', value: 45, count: Math.floor(patientIds.length * 0.45) },
        { name: 'Medium Risk', value: 30, count: Math.floor(patientIds.length * 0.30) },
        { name: 'High Risk', value: 20, count: Math.floor(patientIds.length * 0.20) },
        { name: 'Critical Risk', value: 5, count: Math.floor(patientIds.length * 0.05) }
      ];

      // Outcome metrics
      const outcomeMetrics = [
        { metric: 'Average Mood Improvement', value: 15, trend: 'up' },
        { metric: 'Session Attendance Rate', value: 87, trend: 'up' },
        { metric: 'Task Completion Rate', value: 73, trend: 'down' },
        { metric: 'Patient Engagement Score', value: 82, trend: 'up' }
      ];

      setData({
        moodTrends,
        sessionStats,
        taskCompletion,
        patientEngagement,
        riskDistribution,
        outcomeMetrics
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    // TODO: Implement CSV/PDF export functionality
    console.log('Exporting analytics data...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range and Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Advanced Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into your practice</p>
        </div>
        <div className="flex items-center gap-4">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
          <Button onClick={exportData} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {data.outcomeMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.metric}</p>
                  <p className="text-2xl font-bold">{metric.value}%</p>
                </div>
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="mood" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mood">Mood Trends</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="mood">
          <Card>
            <CardHeader>
              <CardTitle>Patient Mood Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[1, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="averageMood" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Session Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.sessionStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="scheduled" fill="#3b82f6" />
                  <Bar dataKey="completed" fill="#10b981" />
                  <Bar dataKey="cancelled" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.taskCompletion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="completionRate" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data.patientEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="interactions" stroke="#3b82f6" />
                    <Line type="monotone" dataKey="activePatients" stroke="#10b981" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={data.riskDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.riskDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
