
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';

export function QuickStats() {
  const { patients, sessionsToday, pendingTaskCount, loadingPatients, loadingSessions } = useDashboardData();
  
  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      loading: loadingPatients
    },
    {
      title: 'Sessions Today',
      value: sessionsToday.length,
      icon: Calendar,
      loading: loadingSessions
    },
    {
      title: 'Pending Tasks',
      value: pendingTaskCount,
      icon: Clock,
      loading: false
    },
    {
      title: 'Completed Today',
      value: 0,
      icon: CheckCircle,
      loading: false
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stat.loading ? '...' : stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
