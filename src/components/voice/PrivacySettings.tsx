import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Shield, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type PrivacyLevel = 'private' | 'partial_share' | 'full_share';

export function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('private');
  const [anonymize, setAnonymize] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('privacy_level, anonymize_conversations')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPrivacyLevel(data.privacy_level || 'private');
          setAnonymize(data.anonymize_conversations ?? true);
        }
      } catch (error) {
        console.error('Error fetching privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [user]);

  const handlePrivacyLevelChange = async (newLevel: PrivacyLevel) => {
    if (!user) return;
    
    setPrivacyLevel(newLevel);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ privacy_level: newLevel })
        .eq('user_id', user.id);

      if (error) throw error;

      const descriptions = {
        private: 'Tu psicólogo solo verá métricas generales de actividad',
        partial_share: 'Tu psicólogo recibirá reportes e insights generados por IA',
        full_share: 'Tu psicólogo podrá acceder al contenido completo de tus conversaciones'
      };

      toast({
        title: 'Configuración actualizada',
        description: descriptions[newLevel],
      });
    } catch (error) {
      console.error('Error updating privacy level:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración de privacidad',
        variant: 'destructive',
      });
    }
  };

  const handleAnonymizeToggle = async (checked: boolean) => {
    if (!user) return;
    
    setAnonymize(checked);
    
    try {
      const { error } = await supabase
        .from('subscribers')
        .update({ anonymize_conversations: checked })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: checked ? 'Anonimización activada' : 'Anonimización desactivada',
        description: checked 
          ? 'Tus datos personales serán anonimizados antes de ser almacenados'
          : 'Tus conversaciones se guardarán sin anonimizar',
      });
    } catch (error) {
      console.error('Error updating anonymization:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la anonimización',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 animate-pulse" />
          <span className="text-sm text-muted-foreground">Cargando configuración...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <div>
            <h3 className="font-semibold">Configuración de Privacidad</h3>
            <p className="text-sm text-muted-foreground">
              Controla cómo se comparten y almacenan tus conversaciones
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Privacy Level Setting */}
          <div className="p-4 rounded-lg border space-y-4">
            <div>
              <Label className="text-base font-medium flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Nivel de Privacidad
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Controla qué información comparte la IA con tu psicólogo
              </p>
            </div>
            
            <RadioGroup value={privacyLevel} onValueChange={(value) => handlePrivacyLevelChange(value as PrivacyLevel)}>
              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="private" className="font-medium cursor-pointer">
                    Privado
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Solo la IA tiene acceso. Tu psicólogo solo ve métricas generales de actividad (ej: días activos, nivel emocional promedio).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="partial_share" id="partial_share" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="partial_share" className="font-medium cursor-pointer">
                    Compartir Insights
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tu psicólogo recibe reportes automáticos con insights, tendencias emocionales y temas clave, sin ver el texto literal de tus conversaciones.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="full_share" id="full_share" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="full_share" className="font-medium cursor-pointer">
                    Acceso Completo
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tu psicólogo puede ver tus conversaciones completas y generar reportes personalizados. Requiere tu consentimiento explícito.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Anonymization Setting */}
          <div className="flex items-start justify-between p-4 rounded-lg border">
            <div className="flex-1 space-y-1">
              <Label htmlFor="anonymize" className="text-base font-medium flex items-center gap-2">
                {anonymize ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                Anonimizar conversaciones
              </Label>
              <p className="text-sm text-muted-foreground">
                Elimina información personal (nombres, lugares, contactos) antes de guardar tus conversaciones.
                Cumple con GDPR/HIPAA.
              </p>
            </div>
            <Switch
              id="anonymize"
              checked={anonymize}
              onCheckedChange={handleAnonymizeToggle}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="text-xs text-muted-foreground">
            <strong>Nota de seguridad:</strong> Todas las conversaciones se procesan con encriptación de extremo a extremo.
            {anonymize && ' Los datos anonimizados no pueden ser revertidos a su forma original.'}
          </p>
          {privacyLevel === 'full_share' && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              <strong>Importante:</strong> Con acceso completo, tu psicólogo puede ver el contenido literal de tus conversaciones. Puedes cambiar este nivel en cualquier momento.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
