
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useMoodEntries } from '@/hooks/useMoodEntries';
import { Skeleton } from '@/components/ui/skeleton';

export function MoodStatsCard() {
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable' | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { moods } = useMoodEntries();

  useEffect(() => {
    const calculateStats = async () => {
      try {
        setLoading(true);
        
        if (moods.length === 0) {
          setAverageMood(null);
          setTrend(null);
          return;
        }

        // Calculate average mood
        const sum = moods.reduce((acc, entry) => acc + entry.mood_score, 0);
        const avg = sum / moods.length;
        setAverageMood(parseFloat(avg.toFixed(1)));

        // Calculate trend based on recent entries
        if (moods.length > 3) {
          const recentMoods = [...moods].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 3);
          
          const oldestRecent = recentMoods[recentMoods.length - 1];
          const newest = recentMoods[0];
          
          if (newest.mood_score > oldestRecent.mood_score) {
            setTrend('up');
          } else if (newest.mood_score < oldestRecent.mood_score) {
            setTrend('down');
          } else {
            setTrend('stable');
          }
        } else {
          setTrend(null);
        }
      } catch (error) {
        console.error("Error calculating mood stats:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to calculate mood statistics."
        });
      } finally {
        setLoading(false);
      }
    };

    calculateStats();
  }, [moods, toast]);

  const getTrendIcon = () => {
    if (trend === 'up') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (trend === 'down') {
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendText = () => {
    if (trend === 'up') {
      return <span className="text-green-500">Improving</span>;
    } else if (trend === 'down') {
      return <span className="text-red-500">Declining</span>;
    } else {
      return <span className="text-gray-400">Stable</span>;
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Mood</h3>
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {averageMood !== null ? averageMood : "No Data"}
          </div>
          <div className="flex items-center gap-1 text-sm mt-1">
            {getTrendIcon()}
            <span>Trend: {getTrendText()}</span>
          </div>
        </>
      )}
    </Card>
  );
}
