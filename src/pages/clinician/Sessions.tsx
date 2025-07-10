
import { useEffect, useState, useCallback } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, isBefore, addMinutes } from "date-fns";
import { SessionTabs } from "@/components/SessionTabs";
import { SessionHeader } from "@/components/SessionHeader";
import { ScheduleSessionModal } from "@/components/session/ScheduleSessionModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// ✅ Enhanced Session Type with recording info
interface SessionWithPatient {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status?: string;
  notes?: string;
  patient_id: string;
  timezone?: string;
  session_type?: 'online' | 'in_person';
  recording_enabled?: boolean;
  recording_status?: string;
  transcription_status?: string;
  ai_report_status?: string;
  ai_report_id?: string;
  video_call_url?: string;
  video_call_room_id?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
}

export default function Sessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionWithPatient[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          patient:profiles!sessions_patient_id_fkey(first_name, last_name)
        `)
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("❌ Error fetching sessions:", error);
        setError("Failed to load sessions. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Fetched sessions:", data);
        // Set the state with new data, this will trigger a re-render
        setSessions((data || []) as SessionWithPatient[]);
      }
    } catch (err) {
      console.error("Unexpected error fetching sessions:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSessions();
    
    // Set up an interval to refresh session status every minute
    const intervalId = setInterval(() => {
      fetchSessions();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [fetchSessions]);

  const today = new Date();

  // Helper function to determine if a session is past
  const isSessionPast = (session: SessionWithPatient) => {
    try {
      const sessionTime = new Date(session.scheduled_time);
      const sessionEndTime = addMinutes(sessionTime, session.duration_minutes || 30);
      return isBefore(sessionEndTime, today);
    } catch (error) {
      console.error("Error checking session time:", error);
      return false;
    }
  };

  // Filter sessions based on the criteria including end time
  const filtered = {
    // Only show upcoming sessions that are for the selected date AND haven't ended yet
    upcoming: sessions.filter((s) => 
      isSameDay(new Date(s.scheduled_time), selectedDate) && 
      !isSessionPast(s)
    ),
    
    // Show past sessions (ones that have ended)
    past: sessions.filter((s) => isSessionPast(s)),
    
    // All sessions
    all: sessions,
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date));
  };

  const handleSessionDelete = async () => {
    console.log("Session deleted, refreshing sessions list");
    await fetchSessions();
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <SessionHeader 
          onScheduleSession={() => setOpenModal(true)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          getSessionsForDate={getSessionsForDate}
        />

        {/* Error state */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SessionTabs 
          loading={loading}
          filtered={filtered}
          selectedDate={selectedDate}
          onSessionDelete={handleSessionDelete}
        />

        <ScheduleSessionModal 
          open={openModal}
          onClose={() => setOpenModal(false)}
          onScheduled={() => {
            toast({
              title: "Session Scheduled",
              description: "The session was successfully created.",
            });
            setOpenModal(false);
            fetchSessions();
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
