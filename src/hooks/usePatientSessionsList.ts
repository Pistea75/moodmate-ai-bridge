
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Session {
  id: string;
  scheduled_time: string;
  duration_minutes: number;
  status: string;
  notes?: string;
  timezone?: string;
  clinician_name: string; // Add clinician_name property
}

export function usePatientSessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Join with profiles table to get clinician's name
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          *,
          profiles:clinician_id (
            first_name,
            last_name
          )
        `)
        .eq('patient_id', user.id)
        .order('scheduled_time', { ascending: true });
        
      if (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to load sessions');
        return;
      }
      
      // Transform the data to include clinician_name
      const transformedData = (data || []).map(session => {
        const clinicianFirstName = session.profiles?.first_name || '';
        const clinicianLastName = session.profiles?.last_name || '';
        const clinician_name = `${clinicianFirstName} ${clinicianLastName}`.trim() || 'Unknown Clinician';
        
        return {
          ...session,
          clinician_name
        };
      });
      
      setSessions(transformedData);
    } catch (err) {
      console.error('Unexpected error fetching sessions:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch sessions when user changes
  useEffect(() => {
    fetchSessions();
  }, [user]);
  
  // Get sessions for a specific date
  const getSessionsForDate = (selectedDate: Date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.scheduled_time);
      return sessionDate.toDateString() === selectedDate.toDateString();
    });
  };
  
  // Handle schedule button click
  const handleScheduleClick = () => {
    setModalOpen(true);
  };
  
  // Handle schedule completion
  const handleScheduleComplete = () => {
    setModalOpen(false);
    fetchSessions();
  };
  
  return {
    sessions,
    date,
    setDate,
    loading,
    modalOpen,
    setModalOpen,
    isCheckingConnection,
    getSessionsForDate,
    handleScheduleClick,
    handleScheduleComplete,
    fetchSessions,
    error
  };
}
