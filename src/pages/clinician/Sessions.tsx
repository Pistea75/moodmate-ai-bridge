
import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "@/components/SessionCard";
import { useToast } from "@/hooks/use-toast";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { supabase } from "@/integrations/supabase/client";
import { isSameDay, isBefore, isAfter } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

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

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90" onClick={handleScheduleSession}>
            Schedule Session
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          {/* UPCOMING */}
          <TabsContent value="upcoming">
            <Card className="p-4">
              <Calendar
                onChange={(date: Date) => setSelectedDate(date)}
                value={selectedDate}
                tileContent={({ date, view }) => {
                  if (
                    view === "month" &&
                    sessions.some((s) => isSameDay(new Date(s.scheduled_time), date))
                  ) {
                    return (
                      <div className="text-[10px] text-center mt-1 text-mood-purple font-semibold">
                        {sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date)).length}x
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </Card>

            <div className="grid gap-4 mt-6">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : filtered.upcoming.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions for this day.</p>
              ) : (
                filtered.upcoming.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={{
                      ...session,
                      patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                    }}
                    variant="clinician"
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* PAST */}
          <TabsContent value="past">
            <div className="grid gap-4">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : filtered.past.length === 0 ? (
                <p className="text-sm text-muted-foreground">No past sessions.</p>
              ) : (
                filtered.past.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={{
                      ...session,
                      patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                    }}
                    variant="clinician"
                  />
                ))
              )}
            </div>
          </TabsContent>

          {/* ALL */}
          <TabsContent value="all">
            <div className="grid gap-4">
              {loading ? (
                <Skeleton className="h-24 w-full" />
              ) : filtered.all.length === 0 ? (
                <p className="text-sm text-muted-foreground">No sessions found.</p>
              ) : (
                filtered.all.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={{
                      ...session,
                      patientName: `${session.patient?.first_name} ${session.patient?.last_name}`,
                    }}
                    variant="clinician"
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ClinicianLayout>
  );
}
