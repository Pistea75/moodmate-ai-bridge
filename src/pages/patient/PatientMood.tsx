
import PatientLayout from '../../layouts/PatientLayout';
import { MoodChartView } from '@/components/mood/MoodChartView';
import { MoodLogModal } from '@/components/patient/MoodLogModal';
import { Button } from '@/components/ui/button';
import { Heart, Plus } from 'lucide-react';
import { useState } from 'react';

export default function PatientMood() {
  const [showMoodModal, setShowMoodModal] = useState(false);

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Mood Tracking</h1>
            <p className="text-muted-foreground">
              Track and monitor your mood patterns over time.
            </p>
          </div>
          <Button onClick={() => setShowMoodModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Log Mood
          </Button>
        </div>
        
        <div className="grid gap-6">
          <MoodChartView />
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
