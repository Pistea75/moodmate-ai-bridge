
import PatientLayout from '../../layouts/PatientLayout';
import { AIGoalSetting } from '@/components/patient/AIGoalSetting';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Goals() {
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('goalsProgress')}
          </h1>
          <p className="text-gray-600 text-lg">
            {t('setTrackGoalsAI')}
          </p>
        </div>

        {/* AI Goal Setting Component */}
        <AIGoalSetting />
      </div>
    </PatientLayout>
  );
}
