
import React, { useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from '@/components/theme/ColorPicker';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { UserCircle, Link as LinkIcon } from 'lucide-react';
import { useAssignedClinician } from '@/hooks/useAssignedClinician';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchAssignedClinician } from '@/utils/supabase/clinician';

export default function PatientSettings() {
  const { t } = useTranslation();
  const { clinician, loading } = useAssignedClinician();
  const [referralCode, setReferralCode] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const handleLinkPsychologist = async () => {
    if (!referralCode.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un código de referencia",
        variant: "destructive"
      });
      return;
    }

    setIsLinking(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('No user found');
      }

      // Buscar psicólogo por código de referencia
      const { data: psychologist, error: psychError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('referral_code', referralCode.toUpperCase())
        .eq('role', 'psychologist')
        .maybeSingle();

      if (psychError) {
        throw psychError;
      }

      if (!psychologist) {
        toast({
          title: "Error",
          description: "Código de referencia no válido. Verifica que el código sea correcto.",
          variant: "destructive"
        });
        return;
      }

      // Verificar si ya existe un vínculo
      const { data: existingLink } = await supabase
        .from('patient_clinician_links')
        .select('id')
        .eq('patient_id', user.id)
        .maybeSingle();

      if (existingLink) {
        // Actualizar vínculo existente
        const { error: updateError } = await supabase
          .from('patient_clinician_links')
          .update({ clinician_id: psychologist.id })
          .eq('patient_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Crear nuevo vínculo
        const { error: insertError } = await supabase
          .from('patient_clinician_links')
          .insert({
            patient_id: user.id,
            clinician_id: psychologist.id
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "¡Éxito!",
        description: `Ahora estás vinculado con ${psychologist.first_name} ${psychologist.last_name}`
      });

      setReferralCode('');
      
      // Refrescar la página para actualizar la información del psicólogo
      window.location.reload();

    } catch (error) {
      console.error('Error linking psychologist:', error);
      toast({
        title: "Error",
        description: "No se pudo vincular con el psicólogo. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsLinking(false);
    }
  };
  
  return (
    <PatientLayout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t('nav.settings')}</h1>
          <p className="text-muted-foreground">
            {t('settings.description', 'Customize your experience and preferences')}
          </p>
        </div>

        <div className="space-y-6">
          <LanguageSelector />
          
          {/* Clinician Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle className="h-5 w-5" />
                {t('settings.assignedPsychologist', 'Psicólogo Asignado')}
              </CardTitle>
              <CardDescription>
                {t('settings.psychologistDescription', 'Información de tu psicólogo vinculado')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : clinician ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Nombre: </span>
                    <span>{clinician.first_name} {clinician.last_name}</span>
                  </div>
                  <div>
                    <span className="font-medium">Código de Referencia: </span>
                    <span className="font-mono bg-muted px-2 py-1 rounded">{clinician.referral_code}</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  {t('settings.noPsychologistAssigned', 'No tienes psicólogo asignado todavía')}
                </p>
              )}

              <Separator />

              {/* Formulario para vincular psicólogo */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4" />
                  <h3 className="font-medium">
                    {clinician ? 'Cambiar Psicólogo' : 'Vincular Psicólogo'}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Ingresa el código de referencia de tu psicólogo para vincularte
                </p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ej: 6HONYY"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    maxLength={6}
                    className="uppercase"
                    disabled={isLinking}
                  />
                  <Button 
                    onClick={handleLinkPsychologist}
                    disabled={isLinking || !referralCode.trim()}
                  >
                    {isLinking ? 'Vinculando...' : 'Guardar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearance', 'Appearance')}</CardTitle>
              <CardDescription>
                {t('settings.appearanceDescription', 'Customize the look and feel of your dashboard')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('settings.themeColor', 'Theme Color')}</label>
                <ColorPicker />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications', 'Notifications')}</CardTitle>
              <CardDescription>
                {t('settings.notificationsDescription', 'Configure how you want to receive notifications')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('settings.sessionReminders', 'Session Reminders')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.sessionRemindersDescription', 'Get notified about upcoming sessions')}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('settings.comingSoon', 'Coming soon')}
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t('settings.taskNotifications', 'Task Notifications')}</div>
                  <div className="text-sm text-muted-foreground">
                    {t('settings.taskNotificationsDescription', 'Get notified about new tasks and deadlines')}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t('settings.comingSoon', 'Coming soon')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PatientLayout>
  );
}
