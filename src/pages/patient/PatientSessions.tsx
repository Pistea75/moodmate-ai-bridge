
import { useEffect, useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Calendar, Clock } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { supabase } from '@/integrations/supabase/client';
import { format, isSameDay, isBefore } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from '@/lib/utils';

export default function PatientSessions() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          duration_minutes,
          status,
          clinician:clinician_id (
            first_name,
            last_name
          )
        `)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error("❌ Error fetching patient sessions:", error);
      } else {
        setSessions(data || []);
      }

      setLoading(false);
    };

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) => {
    return date
      ? isSameDay(new Date(session.scheduled_time), date)
      : true;
  });

  const isPastSession = (scheduled: string) => isBefore(new Date(scheduled), new Date());

  return (
    <PatientLayout>
      <div className="space-y-6">
        {/* Header + Calendar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Sessions</h1>
            <p className="text-muted-foreground">Manage your therapy sessions</p>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button className="bg-mood-purple hover:bg-mood-purple/90">
              Schedule Session
            </Button>
          </div>
        </div>

        {/* Session Cards */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, idx) => (
              <Skeleton key={idx} className="h-28 w-full rounded-md" />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid gap-4">
            {filteredSessions.map((session) => {
              const clinician = session.clinician;
              const fullName = `${clinician?.first_name || ''} ${clinician?.last_name || ''}`;
              const time = new Date(session.scheduled_time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <Card
                  key={session.id}
                  className={cn(
                    "p-4",
                    isPastSession(session.scheduled_time) || session.status === "completed"
                      ? "bg-muted/50"
                      : ""
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">Therapy Session</h3>
                        {(isPastSession(session.scheduled_time) || session.status === "completed") && (
                          <span className="text-xs bg-muted px-2 py-0.5 rounded">Completed</span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        with {fullName}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(session.scheduled_time), "PPP")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {time} ({session.duration_minutes} min)
                        </span>
                      </div>
                    </div>

                    {!isPastSession(session.scheduled_time) && (
                      <Button variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions scheduled for this date.</p>
            <Button className="mt-4 bg-mood-purple hover:bg-mood-purple/90">
              Schedule Session
            </Button>
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

