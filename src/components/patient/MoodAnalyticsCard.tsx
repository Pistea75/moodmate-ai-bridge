
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly'>('weekly');

  useEffect(() => {
    if (user?.id) {
      fetchMoodData();
    }
  }, [user?.id, timePeriod]);

  const fetchMoodData = async () => {
    if (!user?.id) return;
    
    try {
      const daysAgo = timePeriod === 'daily' ? 1 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      
      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at')
        .eq('patient_id', user.id)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const formattedData = data.map(entry => {
          const date = new Date(entry.created_at);
          return {
            date: date.toLocaleDateString(),
            mood: entry.mood_score,
            day: timePeriod === 'daily' 
              ? date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true })
              : date.toLocaleDateString('en-US', { weekday: 'short' })
          };
        });

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
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Mood Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart className="h-5 w-5 text-primary" />
            Mood Analytics
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant={timePeriod === 'daily' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('daily')}
            >
              Daily
            </Button>
            <Button
              variant={timePeriod === 'weekly' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimePeriod('weekly')}
            >
              7 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {moodData.length > 0 ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                {getTrendIcon()}
                <span className="font-medium">{getTrendText()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">{streak} day good mood streak</span>
              </div>
            </div>
            
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={moodData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <XAxis 
                    dataKey="day" 
                    fontSize={12} 
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 10]} 
                    fontSize={12}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}/10`, 'Mood']}
                    labelFormatter={(label) => `${timePeriod === 'daily' ? 'Time' : 'Day'}: ${label}`}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar 
                    dataKey="mood" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <BarChart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Start tracking your mood to see analytics</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
