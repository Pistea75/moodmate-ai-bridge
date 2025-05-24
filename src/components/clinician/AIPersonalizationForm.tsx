
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Settings } from 'lucide-react';
import { AIPreferences, isValidAIPreferences, getDefaultAIPreferences } from '@/types/aiPersonalization';

interface AIPersonalizationFormProps {
  patientId: string;
}

export function AIPersonalizationForm({ patientId }: AIPersonalizationFormProps) {
  const [preferences, setPreferences] = useState<AIPreferences>(getDefaultAIPreferences());
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('ai_patient_profiles')
          .select('preferences')
          .eq('patient_id', patientId)
          .maybeSingle();

        if (error) {
          console.error('Error loading preferences:', error);
          toast({
            variant: 'destructive',
            title: 'Error loading preferences',
            description: error.message
          });
        } else if (data?.preferences && isValidAIPreferences(data.preferences)) {
          setPreferences(data.preferences);
        }
      } catch (error) {
        console.error('Error in fetchPreferences:', error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPreferences();
    }
  }, [patientId, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('ai_patient_profiles')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      // Cast preferences to Json for Supabase compatibility
      const preferencesAsJson = preferences as any;

      const { error } = existing
        ? await supabase
            .from('ai_patient_profiles')
            .update({ preferences: preferencesAsJson })
            .eq('patient_id', patientId)
        : await supabase
            .from('ai_patient_profiles')
            .insert([{ patient_id: patientId, preferences: preferencesAsJson }]);

      if (error) {
        throw error;
      }

      toast({ 
        title: 'Success',
        description: 'AI personalization saved successfully!' 
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving preferences',
        description: error instanceof Error ? error.message : 'Failed to save preferences'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2">Loading AI preferences...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Personalize AI for Patient
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Challenges / Triggers
            </label>
            <Textarea
              rows={3}
              value={preferences.challenges}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, challenges: e.target.value }))
              }
              placeholder="e.g. anxiety in social settings, fear of failure, work stress"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Recommended Strategies
            </label>
            <Textarea
              rows={3}
              value={preferences.strategies}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, strategies: e.target.value }))
              }
              placeholder="e.g. breathing exercises, CBT thought log, music playlist, mindfulness meditation"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tone Preference
            </label>
            <Textarea
              rows={2}
              value={preferences.tone}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, tone: e.target.value }))
              }
              placeholder="e.g. calm and supportive, gentle but assertive, encouraging and motivational"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Emergency Instructions
            </label>
            <Textarea
              rows={3}
              value={preferences.emergency}
              onChange={(e) =>
                setPreferences((prev) => ({ ...prev, emergency: e.target.value }))
              }
              placeholder="e.g. if suicidal thoughts are expressed, suggest calling a helpline; if panic attacks occur, guide through grounding techniques"
              className="resize-none"
            />
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          <Settings className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save AI Preferences'}
        </Button>
      </CardContent>
    </Card>
  );
}
