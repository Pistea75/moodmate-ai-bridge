
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
    
    // Log patient ID for debugging
    console.log('Fetching logs for patientId:', patientId);
    console.log('Type of patientId:', typeof patientId);
    
    try {
      // Build query with explicit column selection and order
      let query = supabase
        .from('ai_chat_logs')
        .select('id, patient_id, role, message, created_at')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true });

      if (startDate && endDate) {
        // Normalize dates to UTC for consistent filtering
        const startUTC = new Date(startDate);
        startUTC.setUTCHours(0, 0, 0, 0);

        const endUTC = new Date(endDate);
        endUTC.setUTCHours(23, 59, 59, 999);
        
        // Log UTC date strings for debugging
        console.log('Filtering logs with startDate (UTC):', startUTC.toISOString());
        console.log('Filtering logs with endDate (UTC):', endUTC.toISOString());

        query = query
          .gte('created_at', startUTC.toISOString())
          .lte('created_at', endUTC.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching chat logs:', error);
        console.error('Error details:', error.message, error.details);
      } else {
        console.log('Chat logs fetched:', data?.length || 0);
        if (data && data.length > 0) {
          console.log('Sample log entry:', data[0]);
        }
        
        // Sanitize the data to ensure the role property conforms to LogEntry type
        setLogs(
          (data || []).map((entry) => ({
            ...entry,
            role: entry.role === 'user' ? 'user' : 'assistant' as 'user' | 'assistant',
          }))
        );
      }
    } catch (err) {
      console.error('Error in fetchLogs:', err);
    } finally {
      setLoading(false);
    }
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
