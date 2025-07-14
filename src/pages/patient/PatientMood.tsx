
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChart } from '@/components/mood/MoodChart';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PatientMood() {
  const [showMoodModal, setShowMoodModal] = useState(false);
  const { t } = useLanguage();

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('moodTracking')}</h1>
            <p className="text-muted-foreground">
              {t('trackMoodPatternsOverTime')}
            </p>
          </div>
          <Button onClick={() => setShowMoodModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('logMood')}
          </Button>
        </div>
        
        <div className="grid gap-6">
          <MoodChart showLogButton={false} />
        </div>

        {showMoodModal && (
          <MoodLogModal 
            onLogComplete={() => setShowMoodModal(false)} 
          />
        )}
      </div>
    </PatientLayout>
  );
}
