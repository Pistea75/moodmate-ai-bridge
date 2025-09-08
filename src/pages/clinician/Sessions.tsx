
import { useEffect, useState, useCallback } from "react";
import ClinicianLayout from "../../layouts/ClinicianLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, isBefore, addMinutes } from "date-fns";
import { useTranslation } from 'react-i18next';
import { SessionTabs } from "@/components/SessionTabs";
import { SessionHeader } from "@/components/SessionHeader";
import { ScheduleSessionModal } from "@/components/session/ScheduleSessionModal";
import { SessionTemplateSelector } from "@/components/session/SessionTemplateSelector";
import { SessionOutcomeModal } from "@/components/session/SessionOutcomeModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, FileText, Star, Users, Clock, TrendingUp, Calendar, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ Enhanced Session Type with recording info
interface SessionWithPatient {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status?: string;
  notes?: string;
  patient_id: string;
  timezone?: string;
  session_type?: 'online' | 'in_person';
  recording_enabled?: boolean;
  recording_status?: string;
  transcription_status?: string;
  ai_report_status?: string;
  ai_report_id?: string;
  video_call_url?: string;
  video_call_room_id?: string;
  patient: {
    first_name: string;
    last_name: string;
  };
}

export default function Sessions() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<SessionWithPatient[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [openTemplateModal, setOpenTemplateModal] = useState(false);
  const [openOutcomeModal, setOpenOutcomeModal] = useState<{
    open: boolean;
    sessionId: string;
    patientName: string;
    sessionType: string;
  }>({ open: false, sessionId: '', patientName: '', sessionType: '' });
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    totalThisWeek: 0,
    completedToday: 0,
    upcomingToday: 0,
    averageRating: 0
  });

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          patient:profiles!sessions_patient_id_fkey(first_name, last_name)
        `)
        .order("scheduled_time", { ascending: true });

      if (error) {
        console.error("❌ Error fetching sessions:", error);
        setError("Failed to load sessions. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load sessions. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log("Fetched sessions:", data);
        setSessions((data || []) as SessionWithPatient[]);
        
        // Calculate session statistics
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        
        const sessionsData = (data || []) as SessionWithPatient[];
        
        const totalThisWeek = sessionsData.filter(s => {
          const sessionDate = new Date(s.scheduled_time);
          return sessionDate >= weekStart;
        }).length;
        
        const completedToday = sessionsData.filter(s => {
          const sessionDate = new Date(s.scheduled_time);
          return isSameDay(sessionDate, today) && s.status === 'completed';
        }).length;
        
        const upcomingToday = sessionsData.filter(s => {
          const sessionDate = new Date(s.scheduled_time);
          return isSameDay(sessionDate, today) && new Date(s.scheduled_time) > now;
        }).length;
        
        const ratingsQuery = await supabase
          .from('sessions')
          .select('outcome_rating')
          .not('outcome_rating', 'is', null);
          
        const ratings = ratingsQuery.data || [];
        const averageRating = ratings.length > 0 
          ? ratings.reduce((sum, session) => sum + (session.outcome_rating || 0), 0) / ratings.length 
          : 0;
        
        setSessionStats({
          totalThisWeek,
          completedToday,
          upcomingToday,
          averageRating: Math.round(averageRating * 10) / 10
        });
      }
    } catch (err) {
      console.error("Unexpected error fetching sessions:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSessions();
    
    // Set up an interval to refresh session status every minute
    const intervalId = setInterval(() => {
      fetchSessions();
    }, 60000); // Check every minute
    
    return () => clearInterval(intervalId);
  }, [fetchSessions]);

  const today = new Date();

  // Helper function to determine if a session is past
  const isSessionPast = (session: SessionWithPatient) => {
    try {
      const sessionTime = new Date(session.scheduled_time);
      const sessionEndTime = addMinutes(sessionTime, session.duration_minutes || 30);
      return isBefore(sessionEndTime, today);
    } catch (error) {
      console.error("Error checking session time:", error);
      return false;
    }
  };

  // Filter sessions based on the criteria including end time
  const filtered = {
    // Only show upcoming sessions that are for the selected date AND haven't ended yet
    upcoming: sessions.filter((s) => 
      isSameDay(new Date(s.scheduled_time), selectedDate) && 
      !isSessionPast(s)
    ),
    
    // Show past sessions (ones that have ended)
    past: sessions.filter((s) => isSessionPast(s)),
    
    // All sessions
    all: sessions,
  };

  const getSessionsForDate = (date: Date) => {
    return sessions.filter((s) => isSameDay(new Date(s.scheduled_time), date));
  };

  const handleSessionDelete = async () => {
    console.log("Session deleted, refreshing sessions list");
    await fetchSessions();
  };

  const handleTemplateSelect = (template: any) => {
    // Open the schedule modal with the template pre-filled
    setOpenModal(true);
  };

  const handleRecordOutcome = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setOpenOutcomeModal({
        open: true,
        sessionId,
        patientName: `${session.patient.first_name} ${session.patient.last_name}`,
        sessionType: session.session_type || 'individual'
      });
    }
  };

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        {/* Enhanced Header with Statistics */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8 text-blue-600" />
              {t('nav.sessions', 'Sessions')}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('manageAppointments')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenTemplateModal(true)}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('templates')}
            </Button>
          </div>
        </div>

        {/* Session Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('thisWeek')}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessionStats.totalThisWeek}</div>
              <p className="text-xs text-muted-foreground">{t('totalSessions')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('completedToday')}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{sessionStats.completedToday}</div>
              <p className="text-xs text-muted-foreground">{t('sessionsFinished')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('upcomingToday')}</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{sessionStats.upcomingToday}</div>
              <p className="text-xs text-muted-foreground">{t('sessionsRemaining')}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('averageRating')}</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {sessionStats.averageRating || '--'}/5
              </div>
              <p className="text-xs text-muted-foreground">{t('sessionOutcomes')}</p>
            </CardContent>
          </Card>
        </div>

        <SessionHeader 
          onScheduleSession={() => setOpenModal(true)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          getSessionsForDate={getSessionsForDate}
        />

        {/* Error state */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SessionTabs 
          loading={loading}
          filtered={filtered}
          selectedDate={selectedDate}
          onSessionDelete={handleSessionDelete}
        />

        <ScheduleSessionModal 
          open={openModal}
          onClose={() => setOpenModal(false)}
          onScheduled={() => {
            toast({
              title: "Session Scheduled",
              description: "The session was successfully created.",
            });
            setOpenModal(false);
            fetchSessions();
          }}
        />

        <SessionTemplateSelector
          open={openTemplateModal}
          onClose={() => setOpenTemplateModal(false)}
          onSelectTemplate={handleTemplateSelect}
        />

        <SessionOutcomeModal
          open={openOutcomeModal.open}
          onClose={() => setOpenOutcomeModal({ open: false, sessionId: '', patientName: '', sessionType: '' })}
          sessionId={openOutcomeModal.sessionId}
          patientName={openOutcomeModal.patientName}
          sessionType={openOutcomeModal.sessionType}
          onComplete={() => {
            fetchSessions();
            toast({
              title: "Session Outcome Recorded",
              description: "Session has been successfully updated with outcome data."
            });
          }}
        />
      </div>
    </ClinicianLayout>
  );
}
