
import React from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelect } from '@/components/profile/LanguageSelect';
import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientSettings() {
  const { t } = useLanguage();
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
    <PatientLayout>
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">{t('settings')}</h1>
        </div>
        
        <div className="grid gap-6">
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
    </PatientLayout>
  );
}
