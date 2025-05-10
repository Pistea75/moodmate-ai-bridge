
import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, isBefore, addMinutes } from "date-fns";
import { SessionTabs } from "@/components/SessionTabs";
import { SessionHeader } from "@/components/SessionHeader";
import { ScheduleSessionModal } from "@/components/session/ScheduleSessionModal";

// ✅ Custom Type
interface SessionWithPatient {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status?: string;
  notes?: string;
  patient_id: string;
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

  const fetchSessions = async () => {
    setLoading(true);
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
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again.",
          variant: "destructive",
        });
      } else {
        setSessions((data || []) as SessionWithPatient[]);
      }
    } catch (err) {
      console.error("Unexpected error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    
    // Set up an interval to refresh session status every minute
    const intervalId = setInterval(() => {
      fetchSessions();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, []);

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

  const handleSessionDelete = () => {
    console.log("Session deleted, refreshing sessions list");
    fetchSessions();
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
