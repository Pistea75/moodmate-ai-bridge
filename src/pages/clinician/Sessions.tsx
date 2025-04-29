
import { useEffect, useState } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SessionCard } from "@/components/SessionCard";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { isSameDay, isBefore } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

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

  // Helper function to render session count indicators for each date
  const getTileContent = (date: Date) => {
    const sessionsOnDate = sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date));
    if (sessionsOnDate.length > 0) {
      return (
        <div className="text-[10px] text-center mt-1 text-mood-purple font-semibold">
          {sessionsOnDate.length}x
        </div>
      );
    }
    return null;
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
              <div className="flex justify-center mb-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        selectedDate.toLocaleDateString('en-US', { 
                          month: 'long', 
                          day: 'numeric',
                          year: 'numeric'
                        })
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => setSelectedDate(date || new Date())}
                      initialFocus
                      className="pointer-events-auto"
                      components={{
                        DayContent: ({ date, ...props }) => (
                          <div className="relative flex h-8 w-8 items-center justify-center p-0">
                            <div {...props} />
                            {getTileContent(date)}
                          </div>
                        ),
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
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
