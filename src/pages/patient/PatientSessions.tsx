
import { useState, useEffect } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import { Button } from "@/components/ui/button";
import { CalendarIcon, Calendar, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { format, isBefore, isSameDay, addMinutes } from "date-fns";
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
  const [hasConnectedClinician, setHasConnectedClinician] = useState<boolean | null>(null);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);

  // Check if the patient has connected to a clinician
  const checkClinicianConnection = async () => {
    setIsCheckingConnection(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return false;
      
      console.log("Checking clinician connection for user:", user.id);
      console.log("User metadata:", user.user_metadata);
      
      // Check user metadata first (faster)
      if (user.user_metadata?.connected_clinician_id) {
        console.log("Found connected clinician in metadata:", user.user_metadata.connected_clinician_id);
        return true;
      }
      
      // Check patient_clinician_links table
      const { data: linkData } = await supabase
        .from("patient_clinician_links")
        .select("clinician_id")
        .eq("patient_id", user.id)
        .maybeSingle();
        
      if (linkData?.clinician_id) {
        console.log("Found linked clinician:", linkData.clinician_id);
        return true;
      }
      
      // If not in links, check profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .maybeSingle();
        
      if (profile?.referral_code) {
        console.log("Found referral code in profile:", profile.referral_code);
        
        // Verify the referral code links to a valid clinician
        const { data: clinician } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", profile.referral_code)
          .eq("role", "clinician")
          .maybeSingle();
          
        if (clinician?.id) {
          console.log("Verified clinician from referral code:", clinician.id);
          return true;
        }
      }
      
      console.log("No clinician connection found");
      return false;
    } catch (error) {
      console.error("Error checking clinician connection:", error);
      return false;
    } finally {
      setIsCheckingConnection(false);
    }
  };

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
        clinician_name: s.clinician ? 
          `${s.clinician?.first_name || ""} ${s.clinician?.last_name || ""}`.trim() || "Your Clinician" : 
          "Your Clinician"
      }));
      setSessions(parsed);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
    
    // Set up an interval to refresh session status every minute
    const intervalId = setInterval(() => {
      fetchSessions();
    }, 60000); // Check every minute
    
    // Check if the patient has a connected clinician
    checkClinicianConnection().then(setHasConnectedClinician);
    
    return () => clearInterval(intervalId);
  }, []);

  const filteredSessions = sessions.filter((session) =>
    isSameDay(new Date(session.scheduled_time), date)
  );

  // More accurate method to determine if a session is past (includes session duration)
  const isPast = (sessionDate: string, durationMinutes: number = 30) => {
    const sessionTime = new Date(sessionDate);
    const sessionEndTime = addMinutes(sessionTime, durationMinutes);
    return isBefore(sessionEndTime, new Date());
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) =>
      isSameDay(new Date(session.scheduled_time), date)
    );
  };

  const handleScheduleClick = async () => {
    // Recheck connection status before attempting to schedule
    const isConnected = await checkClinicianConnection();
    setHasConnectedClinician(isConnected);
    
    if (!isConnected) {
      toast.error("You need to connect to a clinician first. Please add a referral code in your settings.");
      return;
    }
    
    setModalOpen(true);
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

            <Button 
              className="bg-mood-purple hover:bg-mood-purple/90"
              onClick={handleScheduleClick}
              disabled={isCheckingConnection}
            >
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
                  isPast(session.scheduled_time, session.duration_minutes) ? "bg-muted/50" : ""
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">Therapy Session</h3>
                      {isPast(session.scheduled_time, session.duration_minutes) && (
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
                  {!isPast(session.scheduled_time, session.duration_minutes) && (
                    <Button variant="outline">View Details</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sessions scheduled for this date.</p>
            <Button 
              className="mt-4 bg-mood-purple hover:bg-mood-purple/90" 
              onClick={handleScheduleClick}
              disabled={isCheckingConnection}
            >
              Schedule Session
            </Button>
          </div>
        )}
      </div>

      {/* Schedule Session Modal - using the unified component with isPatientView=true */}
      <ScheduleSessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onScheduled={handleScheduleComplete}
        isPatientView={true}
      />
    </PatientLayout>
  );
}
