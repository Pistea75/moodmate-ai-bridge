
import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ColorPicker } from '@/components/theme/ColorPicker';
import { LanguageSelector } from '@/components/settings/LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function PatientSettings() {
  const { t } = useTranslation();
  
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
