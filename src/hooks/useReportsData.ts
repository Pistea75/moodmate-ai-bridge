import { useState, useEffect } from 'react';
import { useAiChatReports } from '@/hooks/useAiChatReports';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function useReportsData() {
  const { reports, loading, error, fetchReports } = useAiChatReports();
  const [patientNames, setPatientNames] = useState<{[key: string]: string}>({});
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);

  // Fetch patient names for display
  useEffect(() => {
    const fetchPatientNames = async () => {
      // Get unique patient IDs from reports (these should be the patients whose chats were summarized)
      const patientIds = [...new Set(reports.map(report => report.patient_id))].filter(Boolean);
      
      if (patientIds.length === 0) return;

      console.log('Fetching patient names for IDs:', patientIds);

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
        });
        
        console.log('Patient name mapping:', nameMap);
        setPatientNames(nameMap);
      } catch (err) {
        console.error('Error fetching patient names:', err);
      }
    };

    if (reports.length > 0) {
      fetchPatientNames();
    }
  }, [reports]);

  const formatReportTitle = (report: any) => {
    // Use the patient_id to get the correct patient name (whose chat this report is about)
    const patientName = patientNames[report.patient_id] || 'Unknown Patient';
    const date = new Date(report.chat_date).toLocaleDateString();
    return `${patientName} - ${date}`;
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
      fetchReports();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete report");
    } finally {
      setDeletingReportId(null);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing reports...');
    fetchReports();
    toast.success("Reports refreshed");
  };

  return {
    reports,
    loading,
    error,
    patientNames,
    deletingReportId,
    formatReportTitle,
    handleDelete,
    handleRefresh,
    fetchReports
  };
}
