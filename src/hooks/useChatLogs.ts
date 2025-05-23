
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface LogEntry {
  id: string;
  patient_id: string;
  message: string;
  role: 'user' | 'assistant';
  created_at: string;
}

interface UseChatLogsResult {
  logs: LogEntry[];
  loading: boolean;
  refreshLogs: () => Promise<void>;
}

export function useChatLogs(patientId: string, startDate?: string, endDate?: string): UseChatLogsResult {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(async () => {
    if (!patientId) return;

    setLoading(true);
    let query = supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: true });

    if (startDate && endDate) {
      query = query.gte('created_at', startDate).lte('created_at', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chat logs:', error);
    } else {
      setLogs(
        (data || []).map((entry) => ({
          ...entry,
          role: entry.role as 'user' | 'assistant',
        }))
      );
    }

    setLoading(false);
  }, [patientId, startDate, endDate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refreshLogs: fetchLogs,
  };
}
