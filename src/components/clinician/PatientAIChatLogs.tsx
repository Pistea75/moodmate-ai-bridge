
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { ChatLogList } from './chat/ChatLogList';
import { SummarySection } from './chat/SummarySection';
import { DateRangeFilter } from './chat/DateRangeFilter';
import { endOfDay, startOfDay, subDays } from 'date-fns';
import { getLastSevenDays, ensureDateFormat } from '@/lib/utils/dateHelpers';

interface LogEntry {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export function PatientAIChatLogs({ patientId }: { patientId: string }) {
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

  // UUID validation regex
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  useEffect(() => {
    if (patientId) {
      // Validate the UUID format
      if (!uuidRegex.test(patientId)) {
        console.warn('Invalid patient UUID format:', patientId);
        toast({
          title: "Warning",
          description: "Patient ID format is invalid. This may cause issues with data retrieval.",
          variant: "destructive",
        });
      }
      
      fetchPatientName();
      
      // When component mounts, default to the last 7 days
      const { start, end } = getLastSevenDays();
      setStartDate(start);
      setEndDate(end);
      setIsFilterActive(true);
      
      fetchLogs();
    } else {
      setLoading(false);
    }
  }, [patientId]);

  const fetchPatientName = async () => {
    if (!patientId) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', patientId)
        .single();
      
      if (error) {
        console.error('Error fetching patient name:', error);
        return;
      }

      if (data) {
        setPatientName(`${data.first_name || ''} ${data.last_name || ''}`.trim() || "Patient");
      }
    } catch (err) {
      console.error('Error in fetchPatientName:', err);
    }
  };

  const fetchLogs = async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching logs for patient:', patientId);
      console.log('Patient ID type:', typeof patientId);
      console.log('Is valid UUID format:', uuidRegex.test(patientId));
      
      // First, check if the ai_chat_logs table has entries for this patient
      // Using filter method instead of eq for better type handling
      const { count, error: countError } = await supabase
        .from('ai_chat_logs')
        .select('*', { count: 'exact', head: true })
        .filter('patient_id', 'eq', patientId);
      
      if (countError) {
        console.error('Error checking for chat logs:', countError);
        throw countError;
      }
      
      console.log('Total logs for this patient (before filtering):', count);
      
      let query = supabase
        .from('ai_chat_logs')
        .select('*')
        .filter('patient_id', 'eq', patientId)
        .order('created_at', { ascending: true });
      
      // Apply date filters if active
      if (isFilterActive) {
        if (startDate) {
          // Convert to start of day in ISO format
          const startDateISO = startOfDay(startDate).toISOString();
          console.log('Using startDate ISO:', startDateISO);
          query = query.gte('created_at', startDateISO);
        }
        
        if (endDate) {
          // Convert to end of day in ISO format
          const endDateISO = endOfDay(endDate).toISOString();
          console.log('Using endDate ISO:', endDateISO);
          query = query.lte('created_at', endDateISO);
        }
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching chat logs:', error);
        console.error('Error details:', error.message, error.details, error.hint);
        toast({
          title: "Error",
          description: "Failed to load chat logs. Please try again.",
          variant: "destructive",
        });
        return;
      }

      console.log('Chat logs fetched:', data?.length || 0);
      console.log('First few logs:', data?.slice(0, 3));
      
      if (data && data.length > 0) {
        // Sanitize the data to ensure the role property conforms to LogEntry type
        const sanitized = data.map(log => ({
          ...log,
          role: log.role === 'assistant' ? 'assistant' : 'user'
        })) as LogEntry[];
        
        setLogs(sanitized);
      } else {
        console.log('No chat logs found for this patient in the specified date range');
        setLogs([]);
        
        // If no logs were found with a date filter, try fetching all logs
        if (isFilterActive && startDate && endDate) {
          console.log('Attempting to fetch all logs without date filter');
          
          // Use filter method here too for consistency
          const { data: allData, error: allError } = await supabase
            .from('ai_chat_logs')
            .select('*')
            .filter('patient_id', 'eq', patientId)
            .order('created_at', { ascending: true });
          
          if (!allError && allData && allData.length > 0) {
            console.log('Found logs without date filter:', allData.length);
            toast({
              title: "No logs in date range",
              description: `No logs found in the selected date range. There are ${allData.length} logs in total.`,
            });
          } else {
            // Check if created_at values are null
            const { data: nullCheckData, error: nullCheckError } = await supabase
              .from('ai_chat_logs')
              .select('id, created_at')
              .filter('patient_id', 'eq', patientId)
              .is('created_at', null);
            
            if (!nullCheckError && nullCheckData && nullCheckData.length > 0) {
              console.log('Found logs with NULL created_at:', nullCheckData.length);
              toast({
                title: "Date filtering issue",
                description: "Some chat logs have missing timestamps. Please contact support.",
                variant: "destructive",
              });
            } else {
              console.log('No logs found at all');
            }
          }
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
    console.log('Applying filter with dates:', startDate, endDate);
    console.log('Dates as ISO strings:', 
      startDate ? startDate.toISOString() : 'null',
      endDate ? endDate.toISOString() : 'null'
    );
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
    
    try {
      // Format the logs for the OpenAI API
      const formattedLogs = logs.map(log => ({
        role: log.role,
        content: log.message,
      }));

      // Call the Edge Function
      const response = await fetch('/api/functions/v1/summarize-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: formattedLogs }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error summarizing chat:', error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSummarizing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!summary || !patientId) return;
    
    setSavingReport(true);
    
    try {
      // Get the current user (clinician)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to save a report");
      }
      
      // Save the report to the database
      const { error } = await supabase
        .from('ai_chat_reports')
        .insert({
          patient_id: patientId,
          clinician_id: user.id,
          title: `AI Chat Summary - ${new Date().toLocaleDateString()}`,
          report_type: 'chat_summary',
          content: summary,
          status: 'completed',
          chat_date: new Date().toISOString()
        });

      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Success",
        description: "Report saved successfully",
      });
    } catch (error) {
      console.error('Error saving report:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save report",
        variant: "destructive",
      });
    } finally {
      setSavingReport(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">AI Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        <DateRangeFilter 
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApplyFilter={handleApplyFilter}
          onClearFilter={handleClearFilter}
        />
        
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <>
            <ChatLogList logs={logs} />
            
            <SummarySection 
              summary={summary}
              summarizing={summarizing}
              logs={logs}
              savingReport={savingReport}
              patientName={patientName}
              onSummarize={handleSummarize}
              onSaveReport={handleSaveReport}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
