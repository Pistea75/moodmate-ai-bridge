
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

export interface AiChatReport {
  id: string;
  patient_id: string;
  clinician_id: string;
  title: string;
  report_type: string;
  content: string;
  status: string;
  chat_date: string;
  created_at: string;
}

export function useAiChatReports() {
  const [reports, setReports] = useState<AiChatReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, userRole } = useAuth();

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const userId = user.id;
      console.log(`Fetching reports for ${userRole}:`, userId);
      
      let query = supabase.from('ai_chat_reports').select('*');
      
      // Apply different filters based on user role
      if (userRole === 'clinician') {
        // For clinicians, we rely on RLS policies to filter reports from linked patients
        console.log("Using clinician report filtering");
      } else if (userRole === 'patient') {
        // For patients, only show their own reports
        console.log("Filtering reports for patient:", userId);
        query = query.eq('patient_id', userId);
      }
      
      // Always order by most recent first
      const { data, error } = await query.order('chat_date', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        setError(error.message);
      } else {
        console.log("Retrieved reports:", data?.length || 0);
        console.log("Reports data:", data);
        setReports(data || []);
      }
    } catch (e) {
      console.error("Unexpected error:", e);
      setError(e instanceof Error ? e.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user, userRole]);

  return { reports, loading, error, fetchReports };
}
