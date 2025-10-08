
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EnhancedSessionCard } from "@/components/session/EnhancedSessionCard";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteSession } from "@/utils/sessionUtils";
import { useToast } from "@/hooks/use-toast";
import { SessionRecapModal } from "@/components/clinician/SessionRecapModal";

interface SessionTabsProps {
  loading: boolean;
  filtered: {
    upcoming: any[];
    past: any[];
    all: any[];
  };
  selectedDate: Date;
  onSessionDelete?: () => void;
}

export function SessionTabs({ loading, filtered, onSessionDelete, selectedDate }: SessionTabsProps) {
  const { toast } = useToast();
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  
  const handleDeleteSession = async (sessionId: string) => {
    try {
      setDeletingSessionId(sessionId);
      console.log("SessionTabs: Deleting session with ID:", sessionId);
      
      await deleteSession(sessionId);
      
      // After successful deletion, call the callback to refresh the session list
      if (onSessionDelete) {
        onSessionDelete();
      }
    } catch (error: any) {
      console.error("Error deleting session:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete session",
        variant: "destructive",
      });
    } finally {
      setDeletingSessionId(null);
    }
  };

  return (
    <Tabs defaultValue="upcoming" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
        <TabsTrigger value="all">All</TabsTrigger>
      </TabsList>

      {["upcoming", "past", "all"].map((type) => (
        <TabsContent key={type} value={type}>
          <div className="grid gap-4">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : filtered[type].length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No {type} sessions.
              </p>
            ) : (
              filtered[type].map((session: any) => {
                const isPastOrCompleted = type === 'past' || session.status === 'completed';
                
                return (
                  <div key={session.id} className="space-y-2">
                    <EnhancedSessionCard
                      session={{
                        id: session.id,
                        title: `Session with ${session.patient?.first_name || 'Patient'}`,
                        dateTime: session.scheduled_time || '',
                        duration: session.duration_minutes || 50,
                        patientName: session.patient ? 
                          `${session.patient.first_name || ''} ${session.patient.last_name || ''}`.trim() : 
                          'Unknown Patient',
                        status: session.status || 'upcoming',
                        timezone: session.timezone,
                        sessionType: session.session_type || 'in_person',
                        recordingEnabled: session.recording_enabled || false,
                        recordingStatus: session.recording_status || 'none',
                        transcriptionStatus: session.transcription_status || 'none',
                        aiReportStatus: session.ai_report_status || 'none',
                        notes: session.notes
                      }}
                      variant="default"
                      showControls={type === 'upcoming'}
                      onSessionUpdate={onSessionDelete}
                      onDelete={onSessionDelete}
                    />
                    
                    {/* Add Session Notes button for completed sessions */}
                    {isPastOrCompleted && (
                      <div className="flex justify-end">
                        <SessionRecapModal
                          sessionId={session.id}
                          initialNotes={session.notes || ''}
                          onSaved={onSessionDelete}
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
