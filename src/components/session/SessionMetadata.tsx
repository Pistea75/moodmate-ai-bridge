
import { Calendar, Clock } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

interface SessionMetadataProps {
  dateTime: string;
  duration: number;
  patientName?: string;
  clinicianName?: string;
  variant: 'patient' | 'clinician';
  timezone?: string;
}

// Utility functions with proper timezone support
function formatSessionDate(dateTime: string | undefined | null, timezone?: string): string {
  if (!dateTime) return 'No date';
  try {
    const utcDate = parseISO(dateTime);
    if (!isValid(utcDate)) return 'Invalid Date';
    
    if (timezone) {
      // Convert UTC time to the session's timezone
      const zonedDate = toZonedTime(utcDate, timezone);
      return format(zonedDate, 'MMMM d, yyyy');
    }
    
    return format(utcDate, 'MMMM d, yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

function formatSessionTime(dateTime: string | undefined | null, timezone?: string): string {
  if (!dateTime) return 'No time';
  try {
    const utcDate = parseISO(dateTime);
    if (!isValid(utcDate)) return 'Invalid Time';
    
    if (timezone) {
      // Convert UTC time to the session's timezone
      const zonedDate = toZonedTime(utcDate, timezone);
      return format(zonedDate, 'h:mm a');
    }
    
    return format(utcDate, 'h:mm a');
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Invalid Time';
  }
}

export function SessionMetadata({
  dateTime,
  duration,
  patientName,
  clinicianName,
  variant,
  timezone,
}: SessionMetadataProps) {
  const displayTimezone = timezone || 'UTC';
  
  return (
    <>
      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>{formatSessionDate(dateTime, timezone)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock size={14} />
          <span>
            {formatSessionTime(dateTime, timezone)} ({duration} min)
            {timezone && (
              <span className="ml-1 text-xs text-gray-500">
                {displayTimezone}
              </span>
            )}
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
