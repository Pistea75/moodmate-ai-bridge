
import { formatRecordingTime } from '@/utils/dateTimeUtils';

interface RecordingIndicatorProps {
  isRecording: boolean;
  recordingTime: number;
  timeToSession: string;
}

export function RecordingIndicator({ isRecording, recordingTime, timeToSession }: RecordingIndicatorProps) {
  if (isRecording) {
    return (
      <div className="mt-3 text-xs font-medium inline-flex items-center gap-1.5 px-2 py-1 bg-red-100 text-red-800 rounded">
        <span className="animate-pulse h-2 w-2 bg-red-600 rounded-full"></span>
        Recording: {formatRecordingTime(recordingTime)}
      </div>
    );
  }
  
  if (timeToSession && !isRecording) {
    return (
      <div className="mt-3 text-xs inline-block px-2 py-1 bg-muted rounded">
        Starts in {timeToSession}
      </div>
    );
  }
  
  return null;
}
