
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Users, Calendar, Clock, Activity } from "lucide-react";

interface DashboardStatsProps {
  patientCount: number;
  sessionCount: number;
  pendingTaskCount: number;
  loadingPatients: boolean;
  loadingSessions: boolean;
  loadingTasks: boolean;
}

const weeklySessionData = [
  { day: 'Mon', sessions: 8, mood: 7.2 },
  { day: 'Tue', sessions: 12, mood: 6.8 },
  { day: 'Wed', sessions: 10, mood: 7.5 },
  { day: 'Thu', sessions: 15, mood: 7.1 },
  { day: 'Fri', sessions: 9, mood: 8.0 },
  { day: 'Sat', sessions: 6, mood: 7.8 },
  { day: 'Sun', sessions: 4, mood: 8.2 },
];

const patientStatusData = [
  { name: 'Active', value: 85, color: '#22c55e' },
  { name: 'On Break', value: 12, color: '#f59e0b' },
  { name: 'Completed', value: 23, color: '#3b82f6' },
];

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--primary))",
  },
  mood: {
    label: "Avg Mood",
    color: "hsl(var(--chart-2))",
  },
};

export function DashboardStats({
  patientCount,
  sessionCount,
  pendingTaskCount,
  loadingPatients,
  loadingSessions,
  loadingTasks
}: DashboardStatsProps) {
  const totalSessions = weeklySessionData.reduce((sum, day) => sum + day.sessions, 0);
  const avgMood = weeklySessionData.reduce((sum, day) => sum + day.mood, 0) / weeklySessionData.length;
  const sessionTrend = weeklySessionData[6].sessions > weeklySessionData[0].sessions;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Enhanced KPI Cards */}
      <div className="space-y-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingPatients ? "..." : patientCount}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              {sessionTrend ? (
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              {sessionTrend ? '+' : '-'}8% from last week
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Mood</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgMood.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
              +0.3 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sessions Chart */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Sessions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklySessionData}>
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="sessions" fill="var(--color-sessions)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Patient Status Distribution */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Patient Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {patientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4">
            {patientStatusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </div>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
