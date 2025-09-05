
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useTranslation } from 'react-i18next';

export function QuickStats() {
  const { t } = useTranslation();
  const { patients, sessionsToday, pendingTaskCount, loadingPatients, loadingSessions } = useDashboardData();
  
  const stats = [
    {
      title: t('totalPatients'),
      value: patients.length,
      icon: Users,
      loading: loadingPatients
    },
    {
      title: t('sessionsToday'),
      value: sessionsToday.length,
      icon: Calendar,
      loading: loadingSessions
    },
    {
      title: t('pendingTasks'),
      value: pendingTaskCount,
      icon: Clock,
      loading: false
    },
    {
      title: t('completedToday'),
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
