import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SessionCard } from "@/components/SessionCard";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay } from "date-fns"; // 📅 Date utils

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"today" | "upcoming" | "past">("today");

  useEffect(() => {
    const fetchSessions = async () => {
      const { data } = await supabase
        .from("sessions")
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          patient:patient_id (
            id,
            first_name,
            last_name
          )
        `);

      setSessions(data || []);
      setLoading(false);
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    const scheduledDate = new Date(session.scheduled_time);
    const now = new Date();

    if (view === "today") {
      return (
        scheduledDate >= startOfDay(now) && scheduledDate <= endOfDay(now)
      );
    } else if (view === "upcoming") {
      return scheduledDate > endOfDay(now);
    } else if (view === "past") {
      return scheduledDate < startOfDay(now);
    }
    return false;
  });

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">
              Manage your therapy sessions
            </p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90">
            Schedule Session
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={view === "today" ? "default" : "outline"}
            onClick={() => setView("today")}
          >
            Today's Sessions
          </Button>
          <Button
            variant={view === "upcoming" ? "default" : "outline"}
            onClick={() => setView("upcoming")}
          >
            Upcoming Sessions
          </Button>
          <Button
            variant={view === "past" ? "default" : "outline"}
            onClick={() => setView("past")}
          >
            Past Sessions
          </Button>
        </div>

        {/* Sessions */}
        {loading ? (
          <div className="grid gap-4">
            {[...Array(2)].map((_, idx) => (
              <Skeleton key={idx} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid gap-4">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={{
                  id: session.id,
                  title: "Therapy Session",
                  dateTime: session.scheduled_time,
                  duration: session.duration_minutes,
                  patientName: `${session.patient.first_name} ${session.patient.last_name}`,
                  status: "upcoming",
                }}
                variant="clinician"
              />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm">
            No sessions to display for this view.
          </div>
        )}
      </div>
    </ClinicianLayout>
  );
}
