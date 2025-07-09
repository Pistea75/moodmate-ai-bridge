
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Brain, 
  Heart, 
  Target,
  Award,
  Clock,
  Users
} from "lucide-react";

interface Insight {
  id: string;
  type: 'positive' | 'negative' | 'neutral';
  icon: any;
  title: string;
  description: string;
  metric?: string;
  trend?: 'up' | 'down' | 'stable';
}

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'positive',
    icon: Heart,
    title: 'Mood Improvement',
    description: 'Overall patient mood scores increased by 15% this week',
    metric: '+15%',
    trend: 'up',
  },
  {
    id: '2',
    type: 'positive',
    icon: Target,
    title: 'Task Completion',
    description: '89% of assigned tasks were completed on time',
    metric: '89%',
    trend: 'up',
  },
  {
    id: '3',
    type: 'neutral',
    icon: Clock,
    title: 'Session Duration',
    description: 'Average session length is 52 minutes, within optimal range',
    metric: '52 min',
    trend: 'stable',
  },
  {
    id: '4',
    type: 'negative',
    icon: Users,
    title: 'Attendance Rate',
    description: 'Session attendance dropped to 85% this week',
    metric: '85%',
    trend: 'down',
  },
  {
    id: '5',
    type: 'positive',
    icon: Brain,
    title: 'AI Engagement',
    description: 'Patients are using AI chat 23% more frequently',
    metric: '+23%',
    trend: 'up',
  },
  {
    id: '6',
    type: 'positive',
    icon: Award,
    title: 'Patient Progress',
    description: '12 patients achieved their monthly goals',
    metric: '12',
    trend: 'up',
  },
];

export function DashboardInsights() {
  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'positive': return 'default';
      case 'negative': return 'destructive';
      case 'neutral': return 'secondary';
      default: return 'outline';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Practice Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <div
                key={insight.id}
                className="p-4 rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-5 w-5 ${getInsightColor(insight.type)}`} />
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                  </div>
                  <div className="flex items-center gap-1">
                    {insight.metric && (
                      <Badge variant={getBadgeVariant(insight.type)} className="text-xs">
                        {insight.metric}
                      </Badge>
                    )}
                    {insight.trend && getTrendIcon(insight.trend)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{insight.description}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
