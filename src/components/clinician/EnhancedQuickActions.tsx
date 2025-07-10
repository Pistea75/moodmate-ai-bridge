
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Users, 
  FileText, 
  BarChart3,
  AlertTriangle,
  Brain,
  Zap
} from "lucide-react";

interface EnhancedQuickActionsProps {
  onScheduleSession?: () => void;
  onAddTask?: () => void;
}

export function EnhancedQuickActions({ onScheduleSession, onAddTask }: EnhancedQuickActionsProps) {
  const quickActions = [
    {
      title: 'Schedule Session',
      description: 'Book new appointment',
      icon: Calendar,
      onClick: onScheduleSession,
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700'
    },
    {
      title: 'Add Task',
      description: 'Create patient task',
      icon: Plus,
      onClick: onAddTask,
      color: 'bg-green-50 hover:bg-green-100 text-green-700'
    },
    {
      title: 'View Analytics',
      description: 'Practice insights',
      icon: BarChart3,
      onClick: () => window.location.href = '/clinician/analytics',
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
    },
    {
      title: 'Risk Management',
      description: 'Monitor high-risk patients',
      icon: AlertTriangle,
      onClick: () => window.location.href = '/clinician/risk-management',
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700'
    },
    {
      title: 'View Patients',
      description: 'Patient directory',
      icon: Users,
      onClick: () => window.location.href = '/clinician/patients',
      color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'
    },
    {
      title: 'Train AI',
      description: 'Customize AI responses',
      icon: Brain,
      onClick: () => window.location.href = '/clinician/train-ai',
      color: 'bg-pink-50 hover:bg-pink-100 text-pink-700'
    },
    {
      title: 'Create Report',
      description: 'Generate insights',
      icon: FileText,
      onClick: () => window.location.href = '/clinician/reports',
      color: 'bg-teal-50 hover:bg-teal-100 text-teal-700'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Enhanced Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`flex flex-col items-center gap-2 h-auto py-4 px-3 ${action.color} transition-all hover:scale-105`}
              onClick={action.onClick}
            >
              <action.icon className="h-6 w-6" />
              <div className="text-center">
                <div className="text-sm font-medium">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
