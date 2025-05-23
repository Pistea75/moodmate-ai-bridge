
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { LogEntry, UseChatLogsResult } from './types';
import { 
  fetchPatientName,
  fetchPatientChatLogs,
  checkForLogsOutsideFilter,
  generateChatSummary,
  saveChatReport 
} from './api';
import { getLastSevenDays, validateDateFilter } from './dateUtils';

// Change from 'export' to 'export type' for TypeScript types
export type { LogEntry, UseChatLogsResult } from './types';

export function usePatientAIChatLogs(patientId: string): UseChatLogsResult & { refreshLogs: () => Promise<void> } {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [savingReport, setSavingReport] = useState(false);
  const [patientName, setPatientName] = useState<string>("Patient");
  
  // Date filter states
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);

  useEffect(() => {
    console.log('usePatientAIChatLogs hook initialized with patientId:', patientId);
    if (patientId) {
      initializeData();
    } else {
      setLoading(false);
      console.warn('No patientId provided to usePatientAIChatLogs hook');
    }
  }, [patientId]);

  const initializeData = async () => {
    console.log('Initializing data for patientId:', patientId);
    await fetchPatientName(patientId).then(name => {
      console.log('Patient name fetched:', name);
      setPatientName(name);
    });
    
    // When component mounts, default to the last 7 days
    const { start, end } = getLastSevenDays();
    setStartDate(start);
    setEndDate(end);
    setIsFilterActive(true);
    
    await fetchLogs();
  };

  const fetchLogs = async () => {
    if (!patientId) {
      setLoading(false);
      console.warn('No patientId provided to fetchLogs');
      return;
    }
    
    try {
      setLoading(true);
      
      // Log before fetch to help with debugging
      const totalLogs = await checkForLogsOutsideFilter(patientId, null, null);
      console.log('Total logs for this patient (before filtering):', totalLogs);
      console.log('Using startDate:', startDate ? startDate.toISOString() : 'null');
      console.log('Using endDate:', endDate ? endDate.toISOString() : 'null');
      console.log('Is filter active:', isFilterActive);
      
      // IMPORTANT: Try fetching all logs first, without any date filtering
      console.log('Attempting to fetch all logs without date filter');
      let fetchedLogs = await fetchPatientChatLogs(
        patientId, 
        null,
        null,
        false  // disable filtering completely for initial fetch
      );
      
      console.log('Logs fetched without filter, count:', fetchedLogs.length);
      
      // Only if we found logs, try applying the filter
      if (fetchedLogs.length > 0 && isFilterActive && startDate && endDate) {
        const filteredLogs = await fetchPatientChatLogs(
          patientId, 
          startDate, 
          endDate, 
          true
        );
        
        console.log('Filtered logs fetched, count:', filteredLogs.length);
        
        if (filteredLogs.length > 0) {
          fetchedLogs = filteredLogs;
        } else {
          console.log('No logs in filtered range, using all logs instead');
          toast({
            title: "No logs in date range",
            description: `No logs found in the selected date range. Showing all ${fetchedLogs.length} logs instead.`,
          });
        }
      }
      
      setLogs(fetchedLogs);
    } catch (err) {
      console.error('Error in fetchLogs:', err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching chat logs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = () => {
    if (!validateDateFilter(startDate, endDate)) {
      toast({
        title: "Invalid Date Range",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    setIsFilterActive(true);
    setSummary(null); // Reset summary when filter changes
    fetchLogs();
  };

  const handleClearFilter = () => {
    setStartDate(null);
    setEndDate(null);
    setIsFilterActive(false);
    setSummary(null); // Reset summary when filter changes
    fetchLogs();
  };

  const handleSummarize = async () => {
    if (logs.length === 0) {
      toast({
        title: "No chat logs",
        description: "There are no chat logs to summarize.",
        variant: "destructive",
      });
      return;
    }
    
    setSummarizing(true);
    setSummary(null);
    
    const summaryText = await generateChatSummary(logs);
    if (summaryText) {
      setSummary(summaryText);
    }
    
    setSummarizing(false);
  };

  const handleSaveReport = async () => {
    if (!summary || !patientId) return;
    
    setSavingReport(true);
    const success = await saveChatReport(patientId, summary);
    
    if (success) {
      toast({
        title: "Success",
        description: "Report saved successfully",
      });
    }
    
    setSavingReport(false);
  };
  
  // New function to manually refresh logs
  const refreshLogs = async () => {
    await fetchLogs();
    toast({
      title: "Refreshed",
      description: "Chat logs have been refreshed"
    });
  };

  return {
    logs,
    loading,
    summary,
    summarizing,
    savingReport,
    patientName,
    startDate,
    endDate,
    isFilterActive,
    setStartDate,
    setEndDate,
    handleApplyFilter,
    handleClearFilter,
    handleSummarize,
    handleSaveReport,
    refreshLogs
  };
}
