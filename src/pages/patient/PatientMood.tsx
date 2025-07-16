
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientMood() {
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-gray-900">
              {t('moodTracking')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('trackMoodPatternsOverTime')}
            </p>
          </div>
          <MoodLogModal 
            onLogComplete={() => {
              // Trigger chart refresh
              window.location.reload();
            }}
            trigger={
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('logMood')}
              </Button>
            }
          />
        </div>

        {/* Mood Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">{t('moodTrends')}</h2>
          </div>
          <MoodChart />
        </div>
      </div>
    </PatientLayout>
  );
}
