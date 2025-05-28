
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExerciseLogs } from '@/hooks/useExerciseLogs';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface ExerciseLogsSectionProps {
  patientId: string;
}

export function ExerciseLogsSection({ patientId }: ExerciseLogsSectionProps) {
  const { exerciseLogs, loading, error } = useExerciseLogs(patientId);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading exercise logs...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Exercise Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            Error loading exercise logs: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = (completed: boolean | null) => {
    if (completed === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (completed === false) return <XCircle className="h-4 w-4 text-red-500" />;
    return <Clock className="h-4 w-4 text-yellow-500" />;
  };

  const getStatusBadge = (completed: boolean | null) => {
    if (completed === true) return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    if (completed === false) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Not Completed</Badge>;
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Exercise Tracking
          <Badge variant="secondary">{exerciseLogs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exerciseLogs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No exercise recommendations yet
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.completed)}
                    <span className="font-medium text-sm">
                      {format(new Date(log.recommended_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {getStatusBadge(log.completed)}
                </div>
                
                <p className="text-sm text-gray-700 mt-2">
                  {log.exercise_text}
                </p>
                
                {log.completed_at && (
                  <p className="text-xs text-muted-foreground">
                    Completed on {format(new Date(log.completed_at), 'MMM d, yyyy h:mm a')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
