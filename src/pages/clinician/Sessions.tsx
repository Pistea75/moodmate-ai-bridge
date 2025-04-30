
import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { isSameDay, isBefore } from "date-fns";
import { SessionHeader } from "@/components/SessionHeader";
import { SessionTabs } from "@/components/SessionTabs";
import { SessionCalendar } from "@/components/SessionCalendar";

export default function Sessions() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const handleScheduleSession = () => {
    toast({
      title: "Session Scheduled",
      description: "New session has been scheduled successfully.",
    });
  };

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("sessions")
        .select("*, patient:patient_id(first_name, last_name)")
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("❌ Error fetching sessions:", error);
      } else {
        setSessions(data || []);
      }

      setLoading(false);
    };

    fetchSessions();
  }, []);

  const today = new Date();

  const filtered = {
    upcoming: sessions.filter((s) => isSameDay(new Date(s.scheduled_time), selectedDate)),
    past: sessions.filter((s) => isBefore(new Date(s.scheduled_time), today)),
    all: sessions,
  };

  // Helper function to get session count for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date));
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <SessionHeader onScheduleSession={handleScheduleSession} />
        
        <SessionTabs 
          loading={loading} 
          filtered={filtered}
          selectedDate={selectedDate}
          SessionCalendarComponent={
            <SessionCalendar 
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              getSessionsForDate={getSessionsForDate}
            />
          }
        />
      </div>
    </ClinicianLayout>
  );
}
