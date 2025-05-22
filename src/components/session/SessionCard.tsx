
import { useState } from 'react';
import { SessionMetadata } from './SessionMetadata';
import { SessionStatusIndicator } from './SessionStatusIndicator';
import { RecordingIndicator } from './RecordingIndicator';
import { useSessionCard } from '@/hooks/useSessionCard';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteSession } from '@/utils/sessionUtils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

export type Session = {
  id: string;
  title: string;
  dateTime: string;
  duration: number; // in minutes
  patientName?: string;
  clinicianName?: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
};

interface SessionCardProps {
  session: Session;
  variant: 'patient' | 'clinician';
  onDelete?: () => void;
}

export function SessionCard({ session, variant, onDelete }: SessionCardProps) {
  const {
    canJoin,
    timeToSession,
    isRecording,
    recordingTime,
    handleRecordToggle
  } = useSessionCard(session);
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Ensure session data is valid
  const validSession = {
    ...session,
    dateTime: session.dateTime || '',
    duration: session.duration || 50,
    status: session.status || 'upcoming'
  };
  
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log("SessionCard: Deleting session with ID:", session.id);
      
      await deleteSession(session.id);
      
      toast({
        title: "Session deleted",
        description: "The session has been successfully removed",
      });
      
      // Immediately update the local UI
      if (onDelete) {
        onDelete();
      }
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className={`
      border rounded-xl p-4 ${
        validSession.status === 'cancelled' 
          ? 'bg-muted/50'
          : 'bg-white'
      }
    `}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className={`font-medium ${
            validSession.status === 'cancelled' ? 'text-muted-foreground' : ''
          }`}>
            {validSession.title}
          </h3>
          
          <SessionMetadata
            dateTime={validSession.dateTime}
            duration={validSession.duration}
            patientName={validSession.patientName}
            clinicianName={validSession.clinicianName}
            variant={variant}
          />
          
          <RecordingIndicator 
            isRecording={isRecording}
            recordingTime={recordingTime}
            timeToSession={timeToSession}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <SessionStatusIndicator 
            status={validSession.status}
            isRecording={isRecording}
            recordingTime={recordingTime}
            timeToSession={timeToSession}
            canJoin={canJoin}
            onRecordToggle={handleRecordToggle}
          />
          
          {validSession.status === 'upcoming' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm"
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
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      {validSession.notes && (
        <div className="mt-3 pt-3 border-t text-sm">
          <p className="text-muted-foreground">{validSession.notes}</p>
        </div>
      )}
    </div>
  );
}
