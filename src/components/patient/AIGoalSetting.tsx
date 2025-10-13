
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, Plus, TrendingUp, Brain, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { GoalForm } from './GoalForm';
import { useTranslation } from 'react-i18next';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  category: 'mood' | 'tasks' | 'sessions' | 'exercises';
  created_at: string;
  target_date: string;
  ai_suggestions?: string[];
}

export function AIGoalSetting() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalFormData, setGoalFormData] = useState<string>('');
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchGoals();
      generateAISuggestions();
    }
  }, [user?.id]);

  const fetchGoals = async () => {
    if (!user?.id) return;
    
    try {
      // Mock goals data - in real app, this would come from a goals table
      const mockGoals: Goal[] = [
        {
          id: '1',
          title: t('goals.maintainPositiveMood'),
          description: t('goals.moodGoalDescription'),
          target_value: 21,
          current_value: 15,
          category: 'mood',
          created_at: new Date().toISOString(),
          target_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          ai_suggestions: [
            t('goals.morningMeditation'),
            t('goals.gratitudeJournal'),
            t('goals.dailyWalk')
          ]
        },
        {
          id: '2',
          title: t('goals.completeWeeklyTasks'),
          description: t('goals.taskGoalDescription'),
          target_value: 4,
          current_value: 2,
          category: 'tasks',
          created_at: new Date().toISOString(),
          target_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          ai_suggestions: [
            t('goals.breakLargeTasks'),
            t('goals.setSpecificTimes'),
            t('goals.rewardYourself')
          ]
        }
      ];
      
      setGoals(mockGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAISuggestions = async () => {
    if (!user?.id) return;
    
    setGeneratingSuggestions(true);
    try {
      // Call AI service to generate personalized goal suggestions
      const { data, error } = await supabase.functions.invoke('generate-goal-suggestions', {
        body: { patientId: user.id }
      });

      if (error) {
        console.error('Error from AI service:', error);
        // Fallback suggestions
        setAiSuggestions([
          t('goals.trackMoodDaily'),
          t('goals.deepBreathing'),
          t('goals.completeThreeTasks'),
          t('goals.walkWhenStressed'),
          t('goals.writePositiveThing')
        ]);
      } else {
        setAiSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Error generating AI suggestions:', error);
      // Fallback suggestions
      setAiSuggestions([
        t('goals.trackMoodDaily'),
        t('goals.deepBreathing'),
        t('goals.completeThreeTasks'),
        t('goals.walkWhenStressed'),
        t('goals.writePositiveThing')
      ]);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const createGoalFromSuggestion = (suggestion: string) => {
    setGoalFormData(suggestion);
    setShowGoalForm(true);
  };

  const addNewGoal = (goalData: Omit<Goal, 'id' | 'created_at' | 'current_value'>) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...goalData,
      current_value: 0,
      created_at: new Date().toISOString(),
    };

    setGoals(prev => [...prev, newGoal]);
    toast.success(t('goals.goalCreated'));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
    toast.success(t('goals.goalDeleted'));
  };

  const getProgressPercentage = (goal: Goal) => {
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mood': return '😊';
      case 'tasks': return '✅';
      case 'sessions': return '📅';
      case 'exercises': return '💪';
      default: return '🎯';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mood': return 'bg-pink-100 text-pink-800';
      case 'tasks': return 'bg-green-100 text-green-800';
      case 'sessions': return 'bg-blue-100 text-blue-800';
      case 'exercises': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {t('goals.myGoals')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="p-4 border rounded-lg animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
                  <div className="h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : goals.length > 0 ? (
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(goal.category)}</span>
                      <h3 className="font-semibold">{goal.title}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{goal.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t('goals.progress')}: {goal.current_value}/{goal.target_value}</span>
                      <span>{Math.round(getProgressPercentage(goal))}%</span>
                    </div>
                    <Progress value={getProgressPercentage(goal)} className="h-2" />
                  </div>

                  {goal.ai_suggestions && goal.ai_suggestions.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                        <Brain className="h-4 w-4" />
                        {t('goals.aiSuggestions')}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {goal.ai_suggestions.map((suggestion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>{t('goals.noGoalsSet')}</p>
              <p className="text-sm">{t('goals.createFirstGoal')}</p>
            </div>
          )}

          <Button 
            onClick={() => {
              setGoalFormData('');
              setShowGoalForm(true);
            }} 
            variant="outline" 
            className="w-full mt-4"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('goals.addNewGoal')}
          </Button>
        </CardContent>
      </Card>

      {/* AI Goal Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            {t('goals.aiGoalSuggestions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {generatingSuggestions ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {aiSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50">
                  <span className="text-sm">{suggestion}</span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => createGoalFromSuggestion(suggestion)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t('goals.add')}
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <Button 
            onClick={generateAISuggestions} 
            variant="outline" 
            className="w-full mt-4"
            disabled={generatingSuggestions}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            {generatingSuggestions ? t('goals.generating') : t('goals.refreshSuggestions')}
          </Button>
        </CardContent>
      </Card>

      {/* Goal Form Modal */}
      <GoalForm
        open={showGoalForm}
        onClose={() => setShowGoalForm(false)}
        onSubmit={addNewGoal}
        initialData={goalFormData}
      />
    </div>
  );
}
