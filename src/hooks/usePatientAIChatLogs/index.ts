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

export function usePatientAIChatLogs(patientId: string): UseChatLogsResult {
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
    if (patientId) {
      initializeData();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  const initializeData = async () => {
    await fetchPatientName(patientId).then(name => setPatientName(name));
    
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
      
      const fetchedLogs = await fetchPatientChatLogs(
        patientId, 
        startDate, 
        endDate, 
        isFilterActive
      );
      
      setLogs(fetchedLogs);
      
      // If no logs were found with a date filter, check if there are logs outside the filter
      if (fetchedLogs.length === 0 && isFilterActive && startDate && endDate) {
        const totalLogCount = await checkForLogsOutsideFilter(patientId, null, null);
        
        if (totalLogCount > 0) {
          toast({
            title: "No logs in date range",
            description: `No logs found in the selected date range. There are ${totalLogCount} logs in total.`,
          });
        }
      }
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
    handleSaveReport
  };
}
