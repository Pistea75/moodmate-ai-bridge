
import { useState, useEffect } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Button } from "@/components/ui/button";
import { CalendarIcon, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format, isBefore, isSameDay } from "date-fns";
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { SessionCalendar } from "@/components/SessionCalendar";
import { ScheduleSessionModal } from "@/components/session/ScheduleSessionModal";

type Session = {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  clinician_name: string;
};

export default function PatientSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sessions")
      .select(`
        id,
        scheduled_time,
        duration_minutes,
        clinician:clinician_id (
          first_name,
          last_name
        )
      `)
      .order("scheduled_time", { ascending: true });

    if (error) {
      console.error("❌ Error fetching sessions:", error);
    } else {
      const parsed = (data || []).map((s: any) => ({
        id: s.id,
        scheduled_time: s.scheduled_time,
        duration_minutes: s.duration_minutes,
        clinician_name: `${s.clinician?.first_name || "Unknown"} ${s.clinician?.last_name || ""}`
      }));
      setSessions(parsed);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) =>
    isSameDay(new Date(session.scheduled_time), date)
  );

  const isPast = (sessionDate: string) => isBefore(new Date(sessionDate), new Date());

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) =>
      isSameDay(new Date(session.scheduled_time), date)
    );
  };

  const handleScheduleComplete = () => {
    toast.success("Session scheduled!");
    fetchSessions();
  };

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>

          <div className="flex items-center gap-2">
            <SessionCalendar 
              selectedDate={date}
              onDateChange={setDate}
              getSessionsForDate={getSessionsForDate}
            />

            <Button className="bg-mood-purple hover:bg-mood-purple/90" onClick={() => setModalOpen(true)}>
              Schedule Session
            </Button>
          </div>
        </div>

        {/* List of Sessions */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "p-4",
                  isPast(session.scheduled_time) ? "bg-muted/50" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Therapy Session</h3>
                      {isPast(session.scheduled_time) && (
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
                  </div>
                  {!isPast(session.scheduled_time) && (
                    <Button variant="outline">View Details</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions scheduled for this date.</p>
            <Button className="mt-4 bg-mood-purple hover:bg-mood-purple/90" onClick={() => setModalOpen(true)}>
              Schedule Session
            </Button>
          </div>
        )}
      </div>

      {/* Schedule Session Modal */}
      <ScheduleSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onScheduled={handleScheduleComplete}
        isPatientView={true}
      />
    </PatientLayout>
  );
}
