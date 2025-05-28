
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExerciseLogs } from '@/hooks/useExerciseLogs';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function ExerciseTrackingCard() {
  const { user } = useAuth();
  const { exerciseLogs, loading, error } = useExerciseLogs(user?.id || '');
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Exercise Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Loading exercise progress...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Exercise Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">
            Error loading exercises: {error}
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
    if (completed === false) return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Skipped</Badge>;
    return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
  };

  const recentExercises = showAll ? exerciseLogs : exerciseLogs.slice(0, 3);
  const pendingCount = exerciseLogs.filter(log => log.completed === null).length;
  const completedCount = exerciseLogs.filter(log => log.completed === true).length;
  const totalCount = exerciseLogs.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Exercise Progress
          <Badge variant="secondary">{totalCount}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exerciseLogs.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No exercises recommended yet. Chat with your AI assistant to get personalized recommendations!
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">{totalCount}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>

            {/* Recent Exercises */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Recent Exercises</h4>
              {recentExercises.map((log) => (
                <div key={log.id} className="border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(log.completed)}
                      <span className="font-medium text-sm">
                        {format(new Date(log.recommended_at), 'MMM d')}
                      </span>
                    </div>
                    {getStatusBadge(log.completed)}
                  </div>
                  
                  <p className="text-sm text-gray-700">
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

            {exerciseLogs.length > 3 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `View All ${exerciseLogs.length} Exercises`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
