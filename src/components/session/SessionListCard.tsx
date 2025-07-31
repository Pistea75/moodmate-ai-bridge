
import { format, isBefore, addMinutes, parseISO, isValid } from "date-fns";
import { toZonedTime } from "@/lib/utils/timezoneUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, AlertDialogTrigger, AlertDialogContent, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { PatientSession } from "./SessionList";

interface SessionListCardProps {
  session: PatientSession;
  onDelete: (sessionId: string) => void;
  isDeleting: boolean;
}

// Helper function to safely parse and format session date
function formatSessionDate(dateTime: string, timezone?: string): string {
  if (!dateTime) return 'No date';
  
  try {
    // Try parsing as ISO string first
    let utcDate = parseISO(dateTime);
    
    // If that fails, try as regular Date constructor
    if (!isValid(utcDate)) {
      utcDate = new Date(dateTime);
    }
    
    // Final validation
    if (!isValid(utcDate)) {
      console.error('Invalid date value:', dateTime);
      return 'Invalid Date';
    }
    
    // If timezone is provided, convert to that timezone
    if (timezone && timezone !== 'UTC') {
      try {
        const zonedDate = toZonedTime(utcDate, timezone);
        return format(zonedDate, 'PPP');
      } catch (tzError) {
        console.warn('Timezone conversion failed, using UTC:', tzError);
        return format(utcDate, 'PPP');
      }
    }
    
    return format(utcDate, 'PPP');
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', dateTime);
    return 'Invalid Date';
  }
}

// Helper function to safely parse and format session time
function formatSessionTime(dateTime: string, timezone?: string): string {
  if (!dateTime) return 'No time';
  
  try {
    // Try parsing as ISO string first
    let utcDate = parseISO(dateTime);
    
    // If that fails, try as regular Date constructor
    if (!isValid(utcDate)) {
      utcDate = new Date(dateTime);
    }
    
    // Final validation
    if (!isValid(utcDate)) {
      console.error('Invalid time value:', dateTime);
      return 'Invalid Time';
    }
    
    // If timezone is provided, convert to that timezone
    if (timezone && timezone !== 'UTC') {
      try {
        const zonedDate = toZonedTime(utcDate, timezone);
        return format(zonedDate, 'p');
      } catch (tzError) {
        console.warn('Timezone conversion failed, using UTC:', tzError);
        return format(utcDate, 'p');
      }
    }
    
    return format(utcDate, 'p');
  } catch (error) {
    console.error('Error formatting time:', error, 'Input:', dateTime);
    return 'Invalid Time';
  }
}

export function SessionListCard({ session, onDelete, isDeleting }: SessionListCardProps) {
  // Check if a session is past (includes session duration)
  const isPast = (sessionDate: string, durationMinutes: number = 30) => {
    try {
      const sessionTime = parseISO(sessionDate);
      if (!isValid(sessionTime)) {
        return false;
      }
      const sessionEndTime = addMinutes(sessionTime, durationMinutes);
      return isBefore(sessionEndTime, new Date());
    } catch (error) {
      console.error('Error checking if session is past:', error);
      return false;
    }
  };

  const sessionIsPast = isPast(session.scheduled_time, session.duration_minutes);

  return (
    <Card
      className={cn(
        "p-4",
        sessionIsPast ? "bg-muted/50" : ""
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">Therapy Session</h3>
            {sessionIsPast && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded">Completed</span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            with {session.clinician_name}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatSessionDate(session.scheduled_time, session.timezone)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatSessionTime(session.scheduled_time, session.timezone)} ({session.duration_minutes} min)
              {session.timezone && (
                <span className="ml-1 text-xs text-gray-500">
                  {session.timezone}
                </span>
              )}
            </span>
          </div>
          
          {session.notes && (
            <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
              <p>{session.notes}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!sessionIsPast && (
            <>
              <Button variant="outline">View Details</Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Session</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this session? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(session.id)}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
