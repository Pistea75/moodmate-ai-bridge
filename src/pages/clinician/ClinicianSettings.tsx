
import React from 'react';
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { useTranslation } from 'react-i18next';
import { ColorPicker } from '@/components/theme/ColorPicker';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function ClinicianSettings() {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const form = useForm({
    defaultValues: {
      language: user?.user_metadata?.language || 'en',
    }
  });

  const onSubmit = (data: any) => {
    console.log('Settings updated:', data);
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t('settings')}</h1>
        </div>
        
        <div className="grid gap-6">
          <ColorPicker />
          
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('languageSettings')}</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <LanguageSelect form={form} />
                <Button type="submit">{t('save')}</Button>
              </form>
            </Form>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('accountSettings')}</h2>
            <p className="text-muted-foreground">{t('noDataAvailable')}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t('notificationSettings')}</h2>
            <p className="text-muted-foreground">{t('noDataAvailable')}</p>
          </Card>
        </div>
      </div>
    </ClinicianLayout>
  );
}
