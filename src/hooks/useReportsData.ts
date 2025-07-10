
import { useState, useEffect } from 'react';
import { useAiChatReports } from '@/hooks/useAiChatReports';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useReportsData() {
  const { reports: chatReports, loading: chatLoading, error: chatError, fetchReports: fetchChatReports } = useAiChatReports();
  const [sessionReports, setSessionReports] = useState<any[]>([]);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [patientNames, setPatientNames] = useState<{[key: string]: string}>({});
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Combine all reports (chat + session)
  const allReports = [...chatReports, ...sessionReports];
  const combinedLoading = chatLoading || sessionLoading;
  const combinedError = chatError || sessionError;

  // Fetch session reports from sessions with completed AI reports
  const fetchSessionReports = async () => {
    try {
      setSessionLoading(true);
      setSessionError(null);

      const { data: sessionsWithReports, error } = await supabase
        .from('sessions')
        .select(`
          id,
          scheduled_time,
          ai_report_status,
          ai_report_id,
          patient_id,
          clinician_id,
          session_type,
          ai_chat_reports!sessions_ai_report_id_fkey (
            id,
            title,
            content,
            status,
            created_at,
            report_type
          )
        `)
        .eq('ai_report_status', 'completed')
        .not('ai_report_id', 'is', null);

      if (error) throw error;

      // Transform session reports to match the report format
      const formattedSessionReports = sessionsWithReports?.map(session => ({
        id: session.ai_report_id,
        patient_id: session.patient_id,
        clinician_id: session.clinician_id,
        chat_date: session.scheduled_time,
        title: session.ai_chat_reports?.title || `Session Report - ${new Date(session.scheduled_time).toLocaleDateString()}`,
        content: session.ai_chat_reports?.content || '',
        status: session.ai_chat_reports?.status || 'completed',
        report_type: 'session_recording',
        created_at: session.ai_chat_reports?.created_at || session.scheduled_time,
        session_id: session.id,
        session_type: session.session_type
      })) || [];

      console.log('Fetched session reports:', formattedSessionReports);
      setSessionReports(formattedSessionReports);
    } catch (error: any) {
      console.error('Error fetching session reports:', error);
      setSessionError(error.message);
    } finally {
      setSessionLoading(false);
    }
  };

  // Fetch patient names for display
  useEffect(() => {
    const fetchPatientNames = async () => {
      // Get unique patient IDs from all reports
      const patientIds = [...new Set(allReports.map(report => report.patient_id))].filter(Boolean);
      
      if (patientIds.length === 0) return;

      console.log('Fetching patient names for IDs:', patientIds);
      console.log('Sample report structure:', allReports[0]);
      console.log('Reports with patient_id and clinician_id:', allReports.map(r => ({
        id: r.id,
        patient_id: r.patient_id,
        clinician_id: r.clinician_id,
        title: r.title,
        report_type: r.report_type
      })));

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', patientIds);

        if (error) {
          console.error('Error fetching patient names:', error);
          return;
        }

        console.log('Fetched patient profiles:', data);

        const nameMap: {[key: string]: string} = {};
        data?.forEach(profile => {
          const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          nameMap[profile.id] = fullName || 'Unknown Patient';
          console.log(`Mapped patient ID ${profile.id} to name: "${fullName}"`);
        });
        
        console.log('Patient name mapping:', nameMap);
        setPatientNames(nameMap);
      } catch (err) {
        console.error('Error fetching patient names:', err);
      }
    };

    if (allReports.length > 0) {
      fetchPatientNames();
    }
  }, [allReports]);

  // Fetch both types of reports
  useEffect(() => {
    fetchSessionReports();
  }, [chatReports]); // Refetch session reports when chat reports change

  const formatReportTitle = (report: any) => {
    // Use the patient_id to get the correct patient name (whose chat this report is about)
    const patientName = patientNames[report.patient_id] || 'Unknown Patient';
    const date = new Date(report.chat_date).toLocaleDateString();
    
    // Add type prefix for session reports
    const typePrefix = report.report_type === 'session_recording' ? 'Session: ' : '';
    
    console.log(`Formatting report ${report.id}:`);
    console.log(`- patient_id: ${report.patient_id}`);
    console.log(`- clinician_id: ${report.clinician_id}`);
    console.log(`- report_type: ${report.report_type}`);
    console.log(`- patientNames lookup: ${patientNames[report.patient_id]}`);
    console.log(`- Final title: ${typePrefix}${patientName} - ${date}`);
    
    return `${typePrefix}${patientName} - ${date}`;
  };

  const handleDelete = async (reportId: string) => {
    try {
      setDeletingReportId(reportId);
      
      const { error } = await supabase
        .from('ai_chat_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        throw error;
      }

      toast.success("Report deleted successfully");
      fetchChatReports();
      fetchSessionReports();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete report");
    } finally {
      setDeletingReportId(null);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing reports...');
    fetchChatReports();
    fetchSessionReports();
    toast.success("Reports refreshed");
  };

  return {
    reports: allReports,
    loading: combinedLoading,
    error: combinedError,
    patientNames,
    deletingReportId,
    formatReportTitle,
    handleDelete,
    handleRefresh,
    fetchReports: handleRefresh
  };
}
