
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MessageSquare, Target, TrendingUp, Brain, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function QuickActionsCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const actions = [
    {
      icon: TrendingUp,
      label: t('logMood'),
      onClick: () => navigate('/patient/mood'),
      color: 'text-green-600 bg-green-50 hover:bg-green-100'
    },
    {
      icon: Target,
      label: t('viewTasks'),
      onClick: () => navigate('/patient/tasks'),
      color: 'text-blue-600 bg-blue-50 hover:bg-blue-100'
    },
    {
      icon: MessageSquare,
      label: t('aiChat'),
      onClick: () => navigate('/patient/chat'),
      color: 'text-purple-600 bg-purple-50 hover:bg-purple-100'
    },
    {
      icon: Calendar,
      label: t('sessions'),
      onClick: () => navigate('/patient/sessions'),
      color: 'text-orange-600 bg-orange-50 hover:bg-orange-100'
    },
    {
      icon: Brain,
      label: t('insights'),
      onClick: () => navigate('/patient/insights'),
      color: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
    },
    {
      icon: Settings,
      label: t('nav.settings'),
      onClick: () => navigate('/patient/settings'),
      color: 'text-gray-600 bg-gray-50 hover:bg-gray-100'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant="outline"
                onClick={action.onClick}
                className={`flex flex-col items-center gap-2 h-auto py-4 ${action.color} border-transparent`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
