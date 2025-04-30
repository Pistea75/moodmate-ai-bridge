
import { Mic, MicOff } from 'lucide-react';
import { formatRecordingTime } from '@/utils/dateTimeUtils';

interface SessionStatusIndicatorProps {
  status: 'upcoming' | 'completed' | 'cancelled';
  isRecording: boolean;
  recordingTime: number;
  timeToSession: string;
  canJoin: boolean;
  onRecordToggle: () => void;
}

export function SessionStatusIndicator({ 
  status, 
  isRecording, 
  recordingTime,
  timeToSession,
  canJoin,
  onRecordToggle 
}: SessionStatusIndicatorProps) {
  // Status button based on session status
  if (status === 'upcoming') {
    return (
      <div className="flex-shrink-0">
        <button 
          disabled={!canJoin} 
          onClick={onRecordToggle}
          className={`
            px-4 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5
            ${isRecording 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : canJoin
                ? 'bg-mood-purple text-white hover:bg-mood-purple-secondary' 
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }
          `}
        >
          {isRecording ? (
            <>
              <MicOff size={14} />
              Stop Recording
            </>
          ) : (
            <>
              <Mic size={14} />
              Record Session
            </>
          )}
        </button>
      </div>
    );
  }
  
  if (status === 'cancelled') {
    return (
      <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-xs font-medium">
        Cancelled
      </span>
    );
  }
  
  if (status === 'completed') {
    return (
      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-medium">
        Completed
      </span>
    );
  }
  
  return null;
}
