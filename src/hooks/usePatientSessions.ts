
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { PatientSession } from '@/components/session/SessionList';
import { isSameDay } from 'date-fns';

export const usePatientSessions = () => {
  const [sessions, setSessions] = useState<PatientSession[]>([]);
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
      
      // If not in links, check profile for referral code
      const { data: profile } = await supabase
        .from("profiles")
        .select("referral_code")
        .eq("id", user.id)
        .maybeSingle();
        
      if (profile?.referral_code) {
        console.log("Found referral code in profile:", profile.referral_code);
        const referralCode = profile.referral_code.trim().toUpperCase();
        
        // Verify the referral code links to a valid clinician
        const { data: clinician } = await supabase
          .from("profiles")
          .select("id")
          .eq("role", "clinician")
          .ilike("referral_code", referralCode) // Case-insensitive match
          .maybeSingle();
          
        if (clinician?.id) {
          console.log("Verified clinician from referral code:", clinician.id);
          
          // Store the connection in user metadata for future use
          await supabase.auth.updateUser({
            data: {
              connected_clinician_id: clinician.id
            }
          });
          
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

  return {
    sessions,
    date,
    setDate,
    loading,
    modalOpen,
    setModalOpen,
    hasConnectedClinician,
    isCheckingConnection,
    getSessionsForDate,
    handleScheduleClick,
    handleScheduleComplete,
    fetchSessions
  };
};
