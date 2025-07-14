
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientMood() {
  const { t } = useLanguage();
  const [showMoodLog, setShowMoodLog] = useState(false);

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('moodTracking')}
              </h1>
              <p className="text-gray-600 text-lg">
                {t('trackMoodPatternsOverTime')}
              </p>
            </div>
            <Button 
              onClick={() => setShowMoodLog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {t('logMood')}
            </Button>
          </div>
        </div>

        {/* Mood Chart */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold">{t('moodTrends')}</h2>
          </div>
          <MoodChart />
        </div>

        {/* Mood Log Modal */}
        <MoodLogModal 
          open={showMoodLog} 
          onOpenChange={setShowMoodLog} 
        />
      </div>
    </PatientLayout>
  );
}
