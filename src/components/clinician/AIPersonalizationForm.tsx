
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Settings, Sparkles } from 'lucide-react';

interface AIPersonalizationFormProps {
  patientId: string;
  clinicianId?: string;
}

const defaultPrefs = {
  tone: '',
  strategies: '',
  triggersToAvoid: '',
  motivators: '',
  dosAndDonts: '',
  diagnosis: '',
  personality_traits: '',
  helpful_strategies: '',
  things_to_avoid: '',
  clinical_goals: '',
  learned_from_conversation: false,
  last_learning_date: null
};

export function AIPersonalizationForm({ patientId, clinicianId }: AIPersonalizationFormProps) {
  const [prefs, setPrefs] = useState(defaultPrefs);
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
        } else if (data?.preferences && typeof data.preferences === 'object') {
          setPrefs({ ...defaultPrefs, ...(data.preferences as Record<string, string>) });
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

  const handleChange = (name: string, value: string) => {
    setPrefs(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: existing } = await supabase
        .from('ai_patient_profiles')
        .select('id')
        .eq('patient_id', patientId)
        .maybeSingle();

      const payload = {
        patient_id: patientId,
        ...(clinicianId && { clinician_id: clinicianId }),
        preferences: prefs as any
      };

      const { error } = existing
        ? await supabase
            .from('ai_patient_profiles')
            .update(payload)
            .eq('patient_id', patientId)
        : await supabase
            .from('ai_patient_profiles')
            .insert([payload]);

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
          Personalización de IA para Paciente
          {prefs.learned_from_conversation && (
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Aprendizaje Automático Activo
            </Badge>
          )}
        </CardTitle>
        {prefs.last_learning_date && (
          <p className="text-sm text-muted-foreground">
            Última actualización automática: {new Date(prefs.last_learning_date).toLocaleDateString()}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Tone
            </label>
            <Select value={prefs.tone} onValueChange={(value) => handleChange('tone', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preferred tone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-- Select --</SelectItem>
                <SelectItem value="empathetic">Empathetic</SelectItem>
                <SelectItem value="motivational">Motivational</SelectItem>
                <SelectItem value="calm">Calm</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="gentle">Gentle</SelectItem>
                <SelectItem value="encouraging">Encouraging</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Coping Strategies
            </label>
            <Textarea
              rows={3}
              value={prefs.strategies}
              onChange={(e) => handleChange('strategies', e.target.value)}
              placeholder="e.g. breathing exercises, CBT thought log, music playlist, mindfulness meditation"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Triggers to Avoid
            </label>
            <Textarea
              rows={3}
              value={prefs.triggersToAvoid}
              onChange={(e) => handleChange('triggersToAvoid', e.target.value)}
              placeholder="e.g. avoid discussing family trauma, work stress topics, financial issues"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Motivators / Interests
            </label>
            <Textarea
              rows={3}
              value={prefs.motivators}
              onChange={(e) => handleChange('motivators', e.target.value)}
              placeholder="e.g. loves music, enjoys nature walks, motivated by family goals"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Do's and Don'ts
            </label>
            <Textarea
              rows={3}
              value={prefs.dosAndDonts}
              onChange={(e) => handleChange('dosAndDonts', e.target.value)}
              placeholder="e.g. DO: Use simple language, ask about progress. DON'T: Rush conversations, use clinical jargon"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Diagnóstico
            </label>
            <Textarea
              rows={2}
              value={prefs.diagnosis}
              onChange={(e) => handleChange('diagnosis', e.target.value)}
              placeholder="e.g. Ansiedad generalizada, Depresión mayor, etc."
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Rasgos de Personalidad
            </label>
            <Textarea
              rows={2}
              value={prefs.personality_traits}
              onChange={(e) => handleChange('personality_traits', e.target.value)}
              placeholder="e.g. Introvertido, perfeccionista, sensible, creativo"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Estrategias Útiles Adicionales
            </label>
            <Textarea
              rows={2}
              value={prefs.helpful_strategies}
              onChange={(e) => handleChange('helpful_strategies', e.target.value)}
              placeholder="e.g. Técnicas de relajación progresiva, escritura libre"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Temas a Evitar
            </label>
            <Textarea
              rows={2}
              value={prefs.things_to_avoid}
              onChange={(e) => handleChange('things_to_avoid', e.target.value)}
              placeholder="e.g. Eventos traumáticos específicos, temas familiares sensibles"
              className="resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Objetivos Clínicos
            </label>
            <Textarea
              rows={2}
              value={prefs.clinical_goals}
              onChange={(e) => handleChange('clinical_goals', e.target.value)}
              placeholder="e.g. Reducir ansiedad, mejorar autoestima, desarrollar habilidades de afrontamiento"
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
