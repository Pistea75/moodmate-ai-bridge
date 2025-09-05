
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { usePatientTasks } from '@/hooks/usePatientTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';

export function TasksCompletedCard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    completed: 0,
    total: 0,
    percentage: 0
  });
  const { tasks, loading } = usePatientTasks();
  
  useEffect(() => {
    if (!loading && tasks.length > 0) {
      const completed = tasks.filter(task => task.completed).length;
      const total = tasks.length;
      const percentage = Math.round((completed / total) * 100);
      
      setStats({
        completed,
        total,
        percentage
      });
    }
  }, [tasks, loading]);
  
  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">{t('tasksCompleted')}</h3>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {tasks.length === 0 ? t('noTasks') : `${stats.completed}/${stats.total}`}
          </div>
          <div className="flex items-center gap-1 text-sm mt-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>
              {tasks.length === 0 
                ? t('noTasksAssigned') 
                : `${stats.percentage}% ${t('completionRate')}`}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
