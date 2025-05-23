
import { format, isBefore, isSameDay, addMinutes } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { deleteSession } from "@/utils/sessionUtils";
import { toast } from "sonner";
import { 
  AlertDialog, AlertDialogTrigger, AlertDialogContent, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, 
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction 
} from "@/components/ui/alert-dialog";
import { SessionRecapModal } from "@/components/clinician/SessionRecapModal";

export type PatientSession = {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  clinician_name: string;
  notes?: string;
};

interface SessionListProps {
  sessions: PatientSession[];
  date: Date;
  loading: boolean;
  onScheduleClick: () => void;
  onSessionDelete?: () => void;
}

export function SessionList({ 
  sessions, 
  date, 
  loading, 
  onScheduleClick,
  onSessionDelete 
}: SessionListProps) {
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  
  // Filter sessions for the selected date
  const filteredSessions = sessions.filter((session) =>
    isSameDay(new Date(session.scheduled_time), date)
  );

  // Check if a session is past (includes session duration)
  const isPast = (sessionDate: string, durationMinutes: number = 30) => {
    const sessionTime = new Date(sessionDate);
    const sessionEndTime = addMinutes(sessionTime, durationMinutes);
    return isBefore(sessionEndTime, new Date());
  };
  
  const handleDeleteSession = async (sessionId: string) => {
    if (!sessionId) {
      toast.error("Invalid session ID");
      return;
    }
    
    try {
      setDeletingSessionId(sessionId);
      console.log("SessionList: Deleting session with ID:", sessionId);
      
      await deleteSession(sessionId);
      
      // After successful deletion, call the callback to refresh the session list
      if (onSessionDelete) {
        onSessionDelete();
      }
    } catch (error: any) {
      console.error("Error deleting session:", error);
    } finally {
      setDeletingSessionId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(2)].map((_, idx) => (
          <Skeleton key={idx} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (filteredSessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No sessions scheduled for this date.</p>
        <Button 
          className="mt-4 bg-mood-purple hover:bg-mood-purple/90" 
          onClick={onScheduleClick}
        >
          Schedule Session
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {filteredSessions.map((session) => (
        <Card
          key={session.id}
          className={cn(
            "p-4",
            isPast(session.scheduled_time, session.duration_minutes) ? "bg-muted/50" : ""
          )}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Therapy Session</h3>
                {isPast(session.scheduled_time, session.duration_minutes) && (
                  <span className="text-xs bg-muted px-2 py-0.5 rounded">Completed</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                with {session.clinician_name}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(session.scheduled_time), "PPP")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {format(new Date(session.scheduled_time), "p")} ({session.duration_minutes} min)
                </span>
              </div>
              
              {/* Display session notes if they exist */}
              {session.notes && (
                <div className="mt-2 pt-2 border-t text-sm text-muted-foreground">
                  <p>{session.notes}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isPast(session.scheduled_time, session.duration_minutes) && (
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
                          onClick={() => handleDeleteSession(session.id)}
                          disabled={deletingSessionId === session.id}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {deletingSessionId === session.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
