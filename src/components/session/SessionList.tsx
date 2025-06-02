
import { isSameDay, parseISO, isValid } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { deleteSession } from "@/utils/sessionUtils";
import { toast } from "sonner";
import { SessionListCard } from "./SessionListCard";
import { SessionListEmpty } from "./SessionListEmpty";

export type PatientSession = {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  clinician_name: string;
  notes?: string;
  timezone?: string;
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
  
  // Filter sessions for the selected date with safe date parsing
  const filteredSessions = sessions.filter((session) => {
    try {
      const sessionDate = parseISO(session.scheduled_time);
      if (!isValid(sessionDate)) {
        console.warn('Invalid session date:', session.scheduled_time);
        return false;
      }
      return isSameDay(sessionDate, date);
    } catch (error) {
      console.error('Error filtering session:', error, session);
      return false;
    }
  });
  
  const handleDeleteSession = async (sessionId: string) => {
    if (!sessionId) {
      toast.error("Invalid session ID");
      return;
    }
    
    try {
      setDeletingSessionId(sessionId);
      console.log("SessionList: Deleting session with ID:", sessionId);
      
      await deleteSession(sessionId);
      
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
    return <SessionListEmpty onScheduleClick={onScheduleClick} />;
  }

  return (
    <div className="grid gap-4">
      {filteredSessions.map((session) => (
        <SessionListCard
          key={session.id}
          session={session}
          onDelete={handleDeleteSession}
          isDeleting={deletingSessionId === session.id}
        />
      ))}
    </div>
  );
}
