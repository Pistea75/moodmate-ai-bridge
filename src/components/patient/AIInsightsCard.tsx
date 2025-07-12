
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function AIInsightsCard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      generateDailyInsight();
    }
  }, [user?.id]);

  const generateDailyInsight = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      
      // Get recent mood data
      const { data: moodData } = await supabase
        .from('mood_entries')
        .select('mood_score, triggers, notes')
        .eq('patient_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      // Get recent tasks
      const { data: taskData } = await supabase
        .from('tasks')
        .select('title, completed, due_date')
        .eq('patient_id', user.id)
        .order('inserted_at', { ascending: false })
        .limit(5);

      if (moodData && moodData.length > 0) {
        const avgMood = moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length;
        const completedTasks = taskData?.filter(task => task.completed).length || 0;
        const totalTasks = taskData?.length || 0;
        
        let insightText = '';
        if (avgMood >= 7) {
          insightText = `✨ You're doing great! Your mood has been positive this week (${avgMood.toFixed(1)}/10). `;
        } else if (avgMood >= 4) {
          insightText = `💪 Your mood has been steady this week. Consider what small steps might help you feel even better. `;
        } else {
          insightText = `🌱 I notice your mood has been lower recently. Remember, it's okay to have difficult days. `;
        }

        if (totalTasks > 0) {
          insightText += `You've completed ${completedTasks}/${totalTasks} tasks this week. `;
        }

        setInsight(insightText + "Would you like to chat about how you're feeling?");
      } else {
        setInsight("Welcome! I'm here to support your mental health journey. Let's start by tracking how you're feeling today.");
      }
    } catch (error) {
      console.error('Error generating insight:', error);
      setInsight("I'm here to support you on your mental health journey. Feel free to chat with me anytime!");
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = () => {
    navigate('/patient/chat');
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Brain className="h-5 w-5" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <div className="h-4 bg-purple-100 rounded animate-pulse"></div>
            <div className="h-4 bg-purple-100 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {insight}
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={handleChatClick}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Now
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={generateDailyInsight}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
