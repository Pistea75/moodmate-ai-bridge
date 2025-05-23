
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

  const fetchReports = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data: userData, error: authError } = await supabase.auth.getUser();

      if (authError || !userData.user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const userId = userData.user.id;
      console.log("Fetching reports for clinician:", userId);

      const { data, error } = await supabase
        .from('ai_chat_reports')
        .select('*')
        .eq('clinician_id', userId)
        .order('chat_date', { ascending: false });

      if (error) {
        console.error('Error loading reports:', error);
        setError(error.message);
      } else {
        console.log("Retrieved reports:", data?.length || 0);
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
    fetchReports();
  }, []);

  return { reports, loading, error, fetchReports };
}
