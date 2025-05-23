
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

    const { data: userData, error: authError } = await supabase.auth.getUser();

    if (authError || !userData.user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    const { data, error } = await supabase
      .from('ai_chat_reports')
      .select('*')
      .eq('clinician_id', userId) // adjust if needed to show based on role
      .order('chat_date', { ascending: false });

    if (error) {
      console.error('Error loading reports:', error);
      setError(error.message);
    } else {
      setReports(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return { reports, loading, error, fetchReports };
}
