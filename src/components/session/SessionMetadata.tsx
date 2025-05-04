
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';

interface SessionMetadataProps {
  dateTime: string;
  duration: number;
  patientName?: string;
  clinicianName?: string;
  variant: 'patient' | 'clinician';
}

// Utility functions inlined for simplicity.
// You can move these to dateTimeUtils if you'd prefer.
function formatSessionDate(dateTime: string): string {
  const date = parseISO(dateTime);
  return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid Date';
}

function formatSessionTime(dateTime: string): string {
  const date = parseISO(dateTime);
  return isValid(date) ? format(date, 'h:mm a') : 'Invalid Time';
}

export function SessionMetadata({
  dateTime,
  duration,
  patientName,
  clinicianName,
  variant,
}: SessionMetadataProps) {
  return (
    <>
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formatSessionDate(dateTime)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>
            {formatSessionTime(dateTime)} ({duration} min)
          </span>
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
