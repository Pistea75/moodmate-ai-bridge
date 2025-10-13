
import React, { useState, useEffect } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from '@/components/theme/ColorPicker';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { UserCircle } from 'lucide-react';

interface ClinicianInfo {
  first_name: string;
  last_name: string;
  referral_code: string;
}

export default function PatientSettings() {
  const { t } = useTranslation();
  const [clinician, setClinician] = useState<ClinicianInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClinicianInfo = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get clinician ID from patient_clinician_links
        const { data: link, error: linkError } = await supabase
          .from('patient_clinician_links')
          .select('clinician_id')
          .eq('patient_id', user.id)
          .maybeSingle();

        if (linkError) throw linkError;

        if (!link?.clinician_id) {
          setClinician(null);
          setLoading(false);
          return;
        }

        // Get clinician profile and referral code
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('first_name, last_name, referral_code')
          .eq('id', link.clinician_id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setClinician({
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            referral_code: profile.referral_code || ''
          });
        }
      } catch (error) {
        console.error('Error fetching clinician info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClinicianInfo();
  }, []);
  
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
            <CardContent>
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
