import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVoiceMinutes } from '@/hooks/useVoiceMinutes';

export function PrivacySettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updatePrivacySettings } = useVoiceMinutes();
  const [shareWithClinician, setShareWithClinician] = useState(false);
  const [anonymize, setAnonymize] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('subscribers')
          .select('share_chat_with_clinician, anonymize_conversations')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setShareWithClinician(data.share_chat_with_clinician || false);
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

  const handleShareToggle = async (checked: boolean) => {
    setShareWithClinician(checked);
    await updatePrivacySettings(checked, anonymize);
    
    toast({
      title: checked ? 'Compartir activado' : 'Compartir desactivado',
      description: checked 
        ? 'Tu psicólogo verá resúmenes de tus conversaciones'
        : 'Tu psicólogo no verá tus conversaciones',
    });
  };

  const handleAnonymizeToggle = async (checked: boolean) => {
    setAnonymize(checked);
    await updatePrivacySettings(shareWithClinician, checked);
    
    toast({
      title: checked ? 'Anonimización activada' : 'Anonimización desactivada',
      description: checked 
        ? 'Tus datos personales serán anonimizados antes de ser almacenados'
        : 'Tus conversaciones se guardarán sin anonimizar',
    });
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

          {/* Share with Clinician Setting */}
          <div className="flex items-start justify-between p-4 rounded-lg border">
            <div className="flex-1 space-y-1">
              <Label htmlFor="share" className="text-base font-medium flex items-center gap-2">
                {shareWithClinician ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Compartir con psicólogo
              </Label>
              <p className="text-sm text-muted-foreground">
                {shareWithClinician 
                  ? 'Tu psicólogo verá resúmenes y análisis generados por IA de tus conversaciones.'
                  : 'Tu psicólogo no tendrá acceso a tus conversaciones. Solo verá estadísticas generales.'
                }
              </p>
            </div>
            <Switch
              id="share"
              checked={shareWithClinician}
              onCheckedChange={handleShareToggle}
            />
          </div>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground">
            <strong>Nota de seguridad:</strong> Todas las conversaciones se procesan con encriptación de extremo a extremo.
            {anonymize && ' Los datos anonimizados no pueden ser revertidos a su forma original.'}
          </p>
        </div>
      </div>
    </Card>
  );
}
