
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
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('patient_id', user.id)
        .order('scheduled_time', { ascending: true });
        
      if (error) {
        console.error('Error fetching sessions:', error);
        setError('Failed to load sessions');
        return;
      }
      
      setSessions(data || []);
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
