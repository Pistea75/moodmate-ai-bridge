
import PatientLayout from '../../layouts/PatientLayout';
import { AIGoalSetting } from '@/components/patient/AIGoalSetting';

export default function Goals() {
  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Goals & Progress</h1>
            <p className="text-muted-foreground">
              Set and track your mental health goals with AI assistance.
            </p>
          </div>
        </div>
        
        <AIGoalSetting />
      </div>
    </PatientLayout>
  );
}
