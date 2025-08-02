
import PatientLayout from '../../layouts/PatientLayout';
import { AIGoalSetting } from '@/components/patient/AIGoalSetting';
import { useTranslation } from 'react-i18next';

export default function Goals() {
  const { t } = useTranslation();

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            {t('goalsProgress')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('setTrackGoalsAI')}
          </p>
        </div>

        {/* AI Goal Setting Component */}
        <AIGoalSetting />
      </div>
    </PatientLayout>
  );
}
