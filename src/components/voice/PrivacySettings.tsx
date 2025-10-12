import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type PrivacyLevel = 'private' | 'partial_share' | 'full_share';

export function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>('private');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('privacy_level')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPrivacyLevel(data.privacy_level || 'private');
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
                Control de Acceso del Psicólogo
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                Controla qué información puede ver tu psicólogo de tus conversaciones con la IA
              </p>
            </div>
            
            <RadioGroup value={privacyLevel} onValueChange={(value) => handlePrivacyLevelChange(value as PrivacyLevel)}>
              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="private" id="private" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="private" className="font-medium cursor-pointer">
                    Privado (Sin acceso)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tu psicólogo <strong>NO</strong> puede ver tus conversaciones. Solo recibe métricas generales de actividad (días activos, nivel emocional promedio).
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="partial_share" id="partial_share" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="partial_share" className="font-medium cursor-pointer">
                    Compartir Insights (Sin acceso al chat)
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tu psicólogo recibe reportes automáticos con insights, tendencias emocionales y temas clave. <strong>NO</strong> puede ver el chat literal, solo análisis agregados generados por IA.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="full_share" id="full_share" className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor="full_share" className="font-medium cursor-pointer">
                    Acceso Completo al Chat
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Tu psicólogo <strong>SÍ</strong> puede ver tus conversaciones completas (anonimizadas) y generar reportes personalizados con citas del chat. Requiere tu consentimiento explícito.
                  </p>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Security Note about automatic anonymization */}
          <div className="p-4 rounded-lg border bg-muted/50">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1 space-y-2">
                <Label className="text-base font-medium">
                  Anonimización Automática de la Base de Datos
                </Label>
                <p className="text-sm text-muted-foreground">
                  Por motivos de seguridad (GDPR/HIPAA) y para mejorar nuestro modelo de IA, <strong>todas las conversaciones se anonimizan automáticamente</strong> antes de guardarse en la base de datos.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Los datos personales (nombres, lugares, contactos) se reemplazan por etiquetas genéricas. Esto se aplica <strong>siempre</strong>, independientemente del nivel de acceso de tu psicólogo.
                </p>
                <p className="text-xs text-muted-foreground mt-2 italic">
                  Nota: Los datos anonimizados se usan para investigación y mejora del servicio. No pueden revertirse a su forma original.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <p className="text-xs text-muted-foreground">
            <strong>Privacidad y Seguridad:</strong>
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
            <li>Todas las conversaciones se encriptan de extremo a extremo</li>
            <li>Se anonimizan automáticamente antes de guardarse en la base de datos</li>
            <li>Los datos anonimizados NO pueden revertirse</li>
            <li>Los niveles de acceso controlan QUÉ ve tu psicólogo, NO si se anonimiza (siempre se anonimiza)</li>
          </ul>
          {privacyLevel === 'full_share' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
              <strong>Importante:</strong> Con "Acceso Completo", tu psicólogo puede ver el chat anonimizado. Puedes cambiar este nivel en cualquier momento.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
