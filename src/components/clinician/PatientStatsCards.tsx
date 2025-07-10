import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  AlertTriangle, 
  Activity,
  TrendingUp,
  Calendar
} from 'lucide-react';

interface PatientStats {
  totalPatients: number;
  activeThisWeek: number;
  atRiskPatients: number;
  pendingOnboarding: number;
  avgMoodScore: number;
  upcomingSessions: number;
}

interface PatientStatsCardsProps {
  stats: PatientStats;
  loading?: boolean;
}

export function PatientStatsCards({ stats, loading = false }: PatientStatsCardsProps) {
  const cards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      change: null,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Active This Week',
      value: stats.activeThisWeek,
      icon: UserCheck,
      change: `${stats.totalPatients > 0 ? ((stats.activeThisWeek / stats.totalPatients) * 100).toFixed(0) : 0}%`,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'At Risk',
      value: stats.atRiskPatients,
      icon: AlertTriangle,
      change: stats.atRiskPatients > 0 ? 'Needs attention' : 'All stable',
      color: stats.atRiskPatients > 0 ? 'text-red-600' : 'text-green-600',
      bgColor: stats.atRiskPatients > 0 ? 'bg-red-50' : 'bg-green-50'
    },
    {
      title: 'Avg Mood Score',
      value: stats.avgMoodScore ? stats.avgMoodScore.toFixed(1) : 'N/A',
      icon: Activity,
      change: stats.avgMoodScore ? (stats.avgMoodScore >= 7 ? 'Good' : stats.avgMoodScore >= 5 ? 'Fair' : 'Concerning') : null,
      color: stats.avgMoodScore >= 7 ? 'text-green-600' : stats.avgMoodScore >= 5 ? 'text-yellow-600' : 'text-red-600',
      bgColor: stats.avgMoodScore >= 7 ? 'bg-green-50' : stats.avgMoodScore >= 5 ? 'bg-yellow-50' : 'bg-red-50'
    },
    {
      title: 'Pending Onboarding',
      value: stats.pendingOnboarding,
      icon: TrendingUp,
      change: stats.pendingOnboarding > 0 ? 'Action needed' : 'All complete',
      color: stats.pendingOnboarding > 0 ? 'text-orange-600' : 'text-green-600',
      bgColor: stats.pendingOnboarding > 0 ? 'bg-orange-50' : 'bg-green-50'
    },
    {
      title: 'Upcoming Sessions',
      value: stats.upcomingSessions,
      icon: Calendar,
      change: 'Next 7 days',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-12 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${card.bgColor}`}>
                  <Icon className={`h-4 w-4 ${card.color}`} />
                </div>
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-gray-900">
                  {card.value}
                </div>
                {card.change && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      card.change.includes('Concerning') || card.change.includes('attention') || card.change.includes('needed')
                        ? 'bg-red-100 text-red-700'
                        : card.change.includes('Good') || card.change.includes('complete')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {card.change}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}