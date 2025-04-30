
import { Calendar, Clock } from 'lucide-react';
import { formatSessionDate, formatSessionTime } from '@/utils/dateTimeUtils';

interface SessionMetadataProps {
  dateTime: string;
  duration: number;
  patientName?: string;
  clinicianName?: string;
  variant: 'patient' | 'clinician';
}

export function SessionMetadata({ dateTime, duration, patientName, clinicianName, variant }: SessionMetadataProps) {
  return (
    <>
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formatSessionDate(dateTime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>{formatSessionTime(dateTime)} ({duration} min)</span>
        </div>
      </div>
      
      {variant === 'clinician' && patientName && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Patient: </span>
          <span className="font-medium">{patientName}</span>
        </div>
      )}
      
      {variant === 'patient' && clinicianName && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">With: </span>
          <span className="font-medium">{clinicianName}</span>
        </div>
      )}
    </>
  );
}
