
import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, isBefore } from "date-fns";
import { SessionTabs } from "@/components/SessionTabs";
import { SessionHeader } from "@/components/SessionHeader";
import { ScheduleSessionModal } from "@/components/session/ScheduleSessionModal";

export default function Sessions() {
  const { toast } = useToast();

  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const today = new Date();

  // Fetch all sessions with patient name
  const fetchSessions = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("sessions")
      .select(`
        *,
        patient:patient_id (
          first_name,
          last_name
        )
      `)
      .order("scheduled_time", { ascending: true });

    if (error) {
      console.error("❌ Error fetching sessions:", error);
    } else {
      setSessions(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Tabs filtering
  const filtered = {
    upcoming: sessions.filter((s) => isSameDay(new Date(s.scheduled_time), selectedDate)),
    past: sessions.filter((s) => isBefore(new Date(s.scheduled_time), today)),
    all: sessions,
  };

  // Calendar marker count
  const getSessionsForDate = (date: Date) =>
    sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date));

  return (
    <ClinicianLayout>
      <div className="space-y-6">

        {/* Header + Calendar + Schedule Button */}
        <SessionHeader
          onScheduleSession={() => setOpenModal(true)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          getSessionsForDate={getSessionsForDate}
        />

        {/* Session Tabs (Upcoming / Past / All) */}
        <SessionTabs
          loading={loading}
          filtered={filtered}
          selectedDate={selectedDate}
        />

        {/* Modal for scheduling session */}
        <ScheduleSessionModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onScheduled={() => {
            toast({
              title: "Session Scheduled",
              description: "The session was successfully created.",
            });
            setOpenModal(false);
            fetchSessions(); // Refresh the list
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
