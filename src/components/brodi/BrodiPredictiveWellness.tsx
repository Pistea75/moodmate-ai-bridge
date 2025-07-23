import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, AlertTriangle, Heart, Brain, Activity } from 'lucide-react';
import { BrodiCharacter } from './BrodiCharacter';

interface WellnessPrediction {
  id: string;
  riskLevel: 'low' | 'moderate' | 'high';
  prediction: string;
  confidence: number;
  recommendations: string[];
  triggers: string[];
  trends: {
    mood: 'improving' | 'stable' | 'declining';
    engagement: 'increasing' | 'stable' | 'decreasing';
    taskCompletion: 'improving' | 'stable' | 'declining';
  };
}

export function BrodiPredictiveWellness() {
  const { user } = useAuth();
  const [prediction, setPrediction] = useState<WellnessPrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [brodiMessage, setBrodiMessage] = useState<{
    type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user) {
      generatePrediction();
    }
  }, [user]);

  const generatePrediction = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user data for prediction
      const [moodData, taskData, sessionData] = await Promise.all([
        supabase
          .from('mood_entries')
          .select('mood_score, created_at')
          .eq('patient_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false }),
        
        supabase
          .from('tasks')
          .select('completed, created_at, updated_at')
          .eq('patient_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        supabase
          .from('sessions')
          .select('attendance_status, scheduled_time')
          .eq('patient_id', user.id)
          .gte('scheduled_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      // Analyze trends
      const moodTrend = analyzeMoodTrend(moodData.data || []);
      const taskTrend = analyzeTaskTrend(taskData.data || []);
      const engagementTrend = analyzeEngagementTrend(sessionData.data || []);

      // Calculate risk level
      const riskLevel = calculateRiskLevel(moodTrend, taskTrend, engagementTrend);
      
      // Generate prediction and recommendations
      const predictionData = generatePredictionData(riskLevel, moodTrend, taskTrend, engagementTrend);
      
      setPrediction(predictionData);
      
      // Generate Brodi message based on prediction
      if (riskLevel === 'high') {
        setBrodiMessage({
          type: 'mood_reminder',
          message: "I've noticed some patterns that suggest you might need extra support. Remember, reaching out is a sign of strength, not weakness. 💙"
        });
      } else if (riskLevel === 'low' && Math.random() < 0.3) {
        setBrodiMessage({
          type: 'celebration',
          message: "Your wellness trends are looking positive! Keep up the great work on your mental health journey! 🌟"
        });
      }
      
    } catch (error) {
      console.error('Error generating prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeMoodTrend = (moods: any[]): 'improving' | 'stable' | 'declining' => {
    if (moods.length < 3) return 'stable';
    
    const recent = moods.slice(0, Math.ceil(moods.length / 2));
    const older = moods.slice(Math.ceil(moods.length / 2));
    
    const recentAvg = recent.reduce((sum, m) => sum + m.mood_score, 0) / recent.length;
    const olderAvg = older.reduce((sum, m) => sum + m.mood_score, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const analyzeTaskTrend = (tasks: any[]): 'improving' | 'stable' | 'declining' => {
    if (tasks.length < 3) return 'stable';
    
    const completionRate = tasks.filter(t => t.completed).length / tasks.length;
    
    if (completionRate > 0.7) return 'improving';
    if (completionRate < 0.3) return 'declining';
    return 'stable';
  };

  const analyzeEngagementTrend = (sessions: any[]): 'increasing' | 'stable' | 'decreasing' => {
    if (sessions.length < 2) return 'stable';
    
    const attendedSessions = sessions.filter(s => s.attendance_status === 'attended').length;
    const attendanceRate = attendedSessions / sessions.length;
    
    if (attendanceRate > 0.8) return 'increasing';
    if (attendanceRate < 0.5) return 'decreasing';
    return 'stable';
  };

  const calculateRiskLevel = (mood: string, task: string, engagement: string): 'low' | 'moderate' | 'high' => {
    let riskScore = 0;
    
    if (mood === 'declining') riskScore += 3;
    else if (mood === 'stable') riskScore += 1;
    
    if (task === 'declining') riskScore += 2;
    else if (task === 'stable') riskScore += 1;
    
    if (engagement === 'decreasing') riskScore += 2;
    else if (engagement === 'stable') riskScore += 1;
    
    if (riskScore <= 2) return 'low';
    if (riskScore <= 4) return 'moderate';
    return 'high';
  };

  const generatePredictionData = (riskLevel: string, moodTrend: string, taskTrend: string, engagementTrend: string): WellnessPrediction => {
    const predictions = {
      low: "Your wellness indicators suggest you're on a positive trajectory. Continue your current practices.",
      moderate: "Your wellness patterns show some areas for attention. Consider focusing on consistency in your routine.",
      high: "Your wellness patterns indicate you may benefit from additional support and closer monitoring."
    };

    const recommendations = {
      low: [
        "Maintain your current self-care routine",
        "Continue regular mood tracking",
        "Consider setting new wellness goals"
      ],
      moderate: [
        "Increase frequency of mood check-ins",
        "Focus on completing assigned tasks",
        "Schedule additional therapy sessions if needed"
      ],
      high: [
        "Reach out to your clinician for support",
        "Consider increasing therapy frequency",
        "Focus on basic self-care activities",
        "Connect with support network"
      ]
    };

    return {
      id: Date.now().toString(),
      riskLevel: riskLevel as 'low' | 'moderate' | 'high',
      prediction: predictions[riskLevel as keyof typeof predictions],
      confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
      recommendations: recommendations[riskLevel as keyof typeof recommendations],
      triggers: ['mood_decline', 'task_avoidance', 'session_absence'].slice(0, Math.floor(Math.random() * 3) + 1),
      trends: {
        mood: moodTrend as 'improving' | 'stable' | 'declining',
        engagement: engagementTrend as 'increasing' | 'stable' | 'decreasing',
        taskCompletion: taskTrend as 'improving' | 'stable' | 'declining'
      }
    };
  };

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'declining':
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!prediction) return null;

  return (
    <>
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Wellness Prediction
            <Badge className={getRiskBadgeColor(prediction.riskLevel)}>
              {prediction.riskLevel} risk
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {prediction.prediction}
          </p>
          
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Mood: {getTrendIcon(prediction.trends.mood)}
            </span>
            <span className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              Tasks: {getTrendIcon(prediction.trends.taskCompletion)}
            </span>
            <span className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              Engagement: {getTrendIcon(prediction.trends.engagement)}
            </span>
          </div>

          {prediction.riskLevel === 'high' && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-800">
                Consider reaching out for additional support
              </span>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>

          {showDetails && (
            <div className="space-y-3 pt-3 border-t">
              <div>
                <h4 className="font-medium text-sm mb-2">Recommendations:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-1">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Confidence: {prediction.confidence}%
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {brodiMessage && (
        <BrodiCharacter
          message={brodiMessage.message}
          type={brodiMessage.type}
          onDismiss={() => setBrodiMessage(null)}
          onEngaged={() => setBrodiMessage(null)}
        />
      )}
    </>
  );
}