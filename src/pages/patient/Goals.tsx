
import PatientLayout from '../../layouts/PatientLayout';
import { AIGoalSetting } from '@/components/patient/AIGoalSetting';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Goals() {
  const { t } = useLanguage();
  
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('goalsProgress')}</h1>
            <p className="text-muted-foreground">
              {t('setTrackGoalsAI')}
            </p>
          </div>
        </div>
        
        <AIGoalSetting />
      </div>
    </PatientLayout>
  );
}
