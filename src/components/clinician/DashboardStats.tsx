
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

// Empty data arrays - no sample data
const weeklySessionData: any[] = [];
const patientStatusData: any[] = [];

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
            {patientCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Active patients in your practice
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingSessions ? "..." : sessionCount}</div>
            {sessionCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Scheduled for today
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingTasks ? "..." : pendingTaskCount}</div>
            {pendingTaskCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Tasks awaiting completion
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weekly Sessions Chart - Empty State */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Weekly Sessions Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No session data available</p>
              <p className="text-sm">Chart will appear as you schedule sessions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Status Distribution - Empty State */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="text-lg">Patient Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No patient data available</p>
              <p className="text-sm">Distribution will appear as you add patients</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
