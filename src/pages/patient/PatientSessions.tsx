import { useState, useEffect } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Button } from "@/components/ui/button";
import { CalendarIcon, Calendar, Clock, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isBefore, isSameDay } from "date-fns";
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

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
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleDate, setScheduleDate] = useState<Date>(new Date());
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
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

    fetchSessions();
  }, []);

  const filteredSessions = sessions.filter((session) =>
    isSameDay(new Date(session.scheduled_time), date)
  );

  const isPast = (sessionDate: string) => isBefore(new Date(sessionDate), new Date());

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const handleScheduleSession = async () => {
    setScheduling(true);

    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      toast.error("Not logged in.");
      setScheduling(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("user_id", user.id)
      .single();

    if (profileError || !profile?.referral_code) {
      toast.error("Unable to find your referral code.");
      setScheduling(false);
      return;
    }

    const { data: clinician, error: clinicianError } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", profile.referral_code)
      .eq("role", "clinician")
      .single();

    if (clinicianError || !clinician?.id) {
      toast.error("No clinician found for your referral code.");
      setScheduling(false);
      return;
    }

    const [hour, minute] = scheduleTime.split(":").map(Number);
    const scheduled = new Date(scheduleDate);
    scheduled.setHours(hour, minute, 0, 0);

    const { error: insertError } = await supabase.from("sessions").insert({
      patient_id: user.id,
      clinician_id: clinician.id,
      scheduled_time: scheduled.toISOString(),
      status: "scheduled",
      duration_minutes: 50
    });

    setScheduling(false);
    if (insertError) {
      toast.error("Failed to schedule session.");
    } else {
      toast.success("Session scheduled!");
      setModalOpen(false);
    }
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
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0 m-4 my-8">
          <DialogHeader className="border-b px-6 py-4 bg-white">
            <DialogTitle className="text-xl font-semibold text-gray-900">Schedule Session</DialogTitle>
            <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
              <X className="h-5 w-5" />
            </DialogClose>
          </DialogHeader>

          <div className="space-y-4 px-6 py-5">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <CalendarComponent
                mode="single"
                selected={scheduleDate}
                onSelect={(d) => setScheduleDate(d || new Date())}
                disabled={(d) => d < new Date()}
              />
            </div>

            <div className="space-y-2">
              <Label>Select Time</Label>
              <Select value={scheduleTime} onValueChange={setScheduleTime}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {generateTimeSlots().map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="bg-gray-50 px-6 py-4 border-t">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-mood-purple hover:bg-mood-purple/90 text-white"
              onClick={handleScheduleSession}
              disabled={scheduling}
            >
              {scheduling ? "Scheduling..." : "Schedule Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
}


