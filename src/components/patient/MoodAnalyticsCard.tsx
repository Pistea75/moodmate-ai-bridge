
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MoodDataPoint {
  date: string;
  mood: number;
  day: string;
}

export function MoodAnalyticsCard() {
  const { user } = useAuth();
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (user?.id) {
      fetchMoodData();
    }
  }, [user?.id]);

  const fetchMoodData = async () => {
    if (!user?.id) return;
    
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at')
        .eq('patient_id', user.id)
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map(entry => ({
          date: new Date(entry.created_at).toLocaleDateString(),
          mood: entry.mood_score,
          day: new Date(entry.created_at).toLocaleDateString('en-US', { weekday: 'short' })
        }));

        setMoodData(formattedData);
        
        // Calculate streak (days with mood >= 6)
        let currentStreak = 0;
        for (let i = formattedData.length - 1; i >= 0; i--) {
          if (formattedData[i].mood >= 6) {
            currentStreak++;
          } else {
            break;
          }
        }
        setStreak(currentStreak);

        // Calculate trend
        if (formattedData.length >= 2) {
          const recent = formattedData.slice(-3).reduce((sum, d) => sum + d.mood, 0) / 3;
          const earlier = formattedData.slice(0, 3).reduce((sum, d) => sum + d.mood, 0) / 3;
          
          if (recent > earlier + 0.5) setTrend('up');
          else if (recent < earlier - 0.5) setTrend('down');
          else setTrend('stable');
        }
      }
    } catch (error) {
      console.error('Error fetching mood data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <Target className="h-4 w-4 text-blue-600" />;
    }
  };

  const getTrendText = () => {
    switch (trend) {
      case 'up': return 'Improving';
      case 'down': return 'Needs attention';
      default: return 'Stable';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Mood Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Mood Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {moodData.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="font-medium">{getTrendText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-purple-600" />
                <span>{streak} day good mood streak</span>
              </div>
            </div>
            
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData}>
                  <XAxis dataKey="day" fontSize={12} />
                  <YAxis domain={[0, 10]} fontSize={12} />
                  <Tooltip 
                    formatter={(value) => [`${value}/10`, 'Mood']}
                    labelFormatter={(label) => `Day: ${label}`}
                  />
                  <Bar 
                    dataKey="mood" 
                    fill="#8b5cf6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Start tracking your mood to see analytics</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
