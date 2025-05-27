
import { useNudgeReminder } from '@/hooks/useNudgeReminder';
import { MoodLogModal } from './MoodLogModal';

interface NudgeReminderProps {
  onMoodLogged?: () => void;
}

export function NudgeReminder({ onMoodLogged }: NudgeReminderProps) {
  const { showNudge, setShowNudge } = useNudgeReminder();

  const handleMoodLogged = () => {
    setShowNudge(false);
    onMoodLogged?.();
  };

  if (!showNudge) return null;

  return (
    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-4 border border-yellow-300 text-sm">
      It's been a few days since your last mood check-in. 
      <MoodLogModal 
        onLogComplete={handleMoodLogged}
        trigger={
          <button className="underline ml-1 hover:text-yellow-900">
            Log Mood Now
          </button>
        }
      />
    </div>
  );
}
