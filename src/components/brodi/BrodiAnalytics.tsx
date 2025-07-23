import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, User, MessageCircle, Target, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BrodiAnalyticsProps {
  patientId?: string;
}

interface InteractionSummary {
  totalInteractions: number;
  engagementRate: number;
  effectivenessScore: number;
  topInteractionType: string;
  improvementTrend: 'up' | 'down' | 'stable';
}

interface PatternInsight {
  type: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
}

export function BrodiAnalytics({ patientId }: BrodiAnalyticsProps) {
  const [summary, setSummary] = useState<InteractionSummary | null>(null);
  const [patterns, setPatterns] = useState<PatternInsight[]>([]);
  const [interactionData, setInteractionData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patientId) {
      loadAnalytics();
    }
  }, [patientId]);

  const loadAnalytics = async () => {
    if (!patientId) return;

    try {
      // Load interaction summary
      const { data: interactions } = await supabase
        .from('brodi_interactions')
        .select('*')
        .eq('user_id', patientId)
        .order('created_at', { ascending: false });

      if (interactions) {
        const totalInteractions = interactions.length;
        const engagedCount = interactions.filter(i => i.user_response === 'engaged' || i.user_response === 'completed_action').length;
        const engagementRate = totalInteractions > 0 ? (engagedCount / totalInteractions) * 100 : 0;
        
        const effectivenessScores = interactions.filter(i => i.effectiveness_score).map(i => i.effectiveness_score);
        const avgEffectiveness = effectivenessScores.length > 0 
          ? effectivenessScores.reduce((a, b) => a + b, 0) / effectivenessScores.length 
          : 0;

        // Get most common interaction type
        const typeCounts = interactions.reduce((acc, curr) => {
          acc[curr.interaction_type] = (acc[curr.interaction_type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
        
        const topType = Object.entries(typeCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

        setSummary({
          totalInteractions,
          engagementRate,
          effectivenessScore: avgEffectiveness,
          topInteractionType: topType,
          improvementTrend: engagementRate > 50 ? 'up' : engagementRate > 25 ? 'stable' : 'down'
        });

        // Prepare chart data
        const dailyData = interactions.reduce((acc, curr) => {
          const date = new Date(curr.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        setInteractionData(
          Object.entries(dailyData)
            .slice(-7)
            .map(([date, count]) => ({ date, interactions: count }))
        );
      }

      // Load pattern analysis
      const { data: patternData } = await supabase
        .from('brodi_pattern_analysis')
        .select('*')
        .eq('user_id', patientId)
        .order('confidence_score', { ascending: false });

      if (patternData) {
        const insights: PatternInsight[] = patternData.map(pattern => ({
          type: pattern.pattern_type,
          description: getPatternDescription(pattern.pattern_type, pattern.analysis_data),
          confidence: pattern.confidence_score * 100,
          impact: pattern.confidence_score > 0.8 ? 'high' : pattern.confidence_score > 0.5 ? 'medium' : 'low'
        }));
        
        setPatterns(insights);
      }
    } catch (error) {
      console.error('Error loading Brodi analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPatternDescription = (type: string, data: any): string => {
    switch (type) {
      case 'mood_timing':
        return `Patient typically logs mood entries ${data.preferred_time || 'in the evening'}`;
      case 'task_completion':
        return `Best task completion rate on ${data.best_day || 'weekdays'} (${data.completion_rate || 0}%)`;
      case 'engagement':
        return `Most responsive to ${data.best_interaction_type || 'celebration'} interactions`;
      case 'response_effectiveness':
        return `${data.response_type || 'Encouraging'} messages show ${data.effectiveness || 'good'} results`;
      default:
        return 'Pattern analysis in progress';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-lg">😊</span>
            Brodi Analytics
          </CardTitle>
          <CardDescription>No interaction data available yet</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Brodi will start collecting analytics once the patient begins interacting with the system.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pieData = [
    { name: 'Engaged', value: summary.engagementRate, color: '#22c55e' },
    { name: 'Dismissed', value: 100 - summary.engagementRate, color: '#94a3b8' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Brodi Impact Analytics
          </CardTitle>
          <CardDescription>
            AI companion effectiveness and patient interaction patterns
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Interactions</span>
            </div>
            <p className="text-2xl font-bold">{summary.totalInteractions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Engagement Rate</span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold">{summary.engagementRate.toFixed(1)}%</p>
              {summary.improvementTrend === 'up' && <TrendingUp className="h-4 w-4 text-green-500" />}
              {summary.improvementTrend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Effectiveness</span>
            </div>
            <p className="text-2xl font-bold">{summary.effectivenessScore.toFixed(1)}/10</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Top Interaction</span>
            </div>
            <Badge variant="secondary" className="capitalize">
              {summary.topInteractionType.replace('_', ' ')}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="interactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="interactions">Interaction Trends</TabsTrigger>
          <TabsTrigger value="patterns">AI Patterns</TabsTrigger>
          <TabsTrigger value="engagement">Engagement Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>Daily Interactions (Last 7 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={interactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Bar dataKey="interactions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns">
          <div className="space-y-4">
            {patterns.map((pattern, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium capitalize">{pattern.type.replace('_', ' ')}</h4>
                        <Badge variant={pattern.impact === 'high' ? 'default' : pattern.impact === 'medium' ? 'secondary' : 'outline'}>
                          {pattern.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Confidence</span>
                          <span>{pattern.confidence.toFixed(1)}%</span>
                        </div>
                        <Progress value={pattern.confidence} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {patterns.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">
                    AI is still learning patient patterns. More data needed for insights.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm">Engaged</span>
                    </div>
                    <span className="font-medium">{summary.engagementRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-sm">Dismissed</span>
                    </div>
                    <span className="font-medium">{(100 - summary.engagementRate).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}