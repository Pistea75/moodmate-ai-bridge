import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { LogEntry } from "@/hooks/usePatientAIChatLogs/types";
import { getStartOfDayISO, getEndOfDayISO } from "./dateUtils";
import { formatDateForDisplay } from "@/lib/utils/dateHelpers";

// UUID validation regex
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Fetches patient name from profile
 */
export async function fetchPatientName(patientId: string): Promise<string> {
  if (!patientId) return "Patient";
  
  try {
    console.log('Fetching patient name for ID:', patientId);
    const { data, error } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .filter('id', 'eq', patientId)
      .single();
    
    if (error) {
      console.error('Error fetching patient name:', error);
      return "Patient";
    }

    if (data) {
      return `${data.first_name || ''} ${data.last_name || ''}`.trim() || "Patient";
    }
    
    return "Patient";
  } catch (err) {
    console.error('Error in fetchPatientName:', err);
    return "Patient";
  }
}

/**
 * Fetches AI chat logs for a patient
 */
export async function fetchPatientChatLogs(
  patientId: string, 
  startDate: Date | null = null, 
  endDate: Date | null = null,
  isFilterActive: boolean = false
): Promise<LogEntry[]> {
  if (!patientId) {
    console.error('No patient ID provided for fetchPatientChatLogs');
    return [];
  }
  
  // Validate the UUID format
  if (!uuidRegex.test(patientId)) {
    console.warn('Invalid patient UUID format:', patientId);
    toast({
      title: "Warning",
      description: "Patient ID format is invalid. This may cause issues with data retrieval.",
      variant: "destructive",
    });
  }
  
  try {
    console.log('Fetching logs for patient:', patientId);
    
    // TEMPORARY DEBUGGING: First fetch ALL logs for this patient to see if any exist
    const { count: totalCount, error: countError } = await supabase
      .from('ai_chat_logs')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientId);
    
    console.log(`Total logs for patient ${patientId} (ignoring filters): ${totalCount || 0}`);
    
    if (countError) {
      console.error('Error checking total logs:', countError);
    }
    
    if (totalCount === 0) {
      console.log('No logs found for this patient at all, returning empty array');
      return [];
    }
    
    // Build query
    let query = supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: true });
    
    // TEMPORARILY COMMENT OUT DATE FILTER TO TEST IF LOGS EXIST
    /* 
    // Apply date filters if active
    if (isFilterActive && startDate && endDate) {
      const startDateISO = getStartOfDayISO(startDate);
      const endDateISO = getEndOfDayISO(endDate);
      
      console.log('Date filter:', formatDateForDisplay(startDateISO), 'to', formatDateForDisplay(endDateISO));
      console.log('Raw ISO strings - start:', startDateISO, 'end:', endDateISO);
      
      // Using gte and lte for timestamp comparison with proper UTC values
      query = query
        .gte('created_at', startDateISO)
        .lte('created_at', endDateISO);
    }
    */

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching chat logs:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      
      toast({
        title: "Error",
        description: "Failed to load chat logs. Please try again.",
        variant: "destructive",
      });
      
      return [];
    }

    console.log(`Chat logs fetched: ${data?.length || 0}`);
    console.log('First few logs:', data?.slice(0, 3));
    
    if (data && data.length > 0) {
      // Sanitize the data to ensure the role property conforms to LogEntry type
      return data.map(log => ({
        ...log,
        role: log.role === 'assistant' ? 'assistant' : 'user'
      })) as LogEntry[];
    } 
    
    return [];
  } catch (err) {
    console.error('Error in fetchPatientChatLogs:', err);
    toast({
      title: "Error",
      description: "An unexpected error occurred while fetching chat logs.",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Check if any AI chat logs exist outside of date filter
 */
export async function checkForLogsOutsideFilter(
  patientId: string, 
  startDate: Date | null,
  endDate: Date | null
): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('ai_chat_logs')
      .select('*', { count: 'exact', head: true })
      .filter('patient_id', 'eq', patientId);
      
    if (error) {
      console.error('Error checking for logs outside filter:', error);
      return 0;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error checking for logs outside filter:', error);
    return 0;
  }
}

/**
 * Generate summary of chat logs using OpenAI
 */
export async function generateChatSummary(logs: LogEntry[]): Promise<string | null> {
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
    return data.summary;
  } catch (error) {
    console.error('Error summarizing chat:', error);
    toast({
      title: "Error",
      description: "Failed to generate summary. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}

/**
 * Save chat report to database
 */
export async function saveChatReport(
  patientId: string,
  summary: string
): Promise<boolean> {
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
    
    return true;
  } catch (error) {
    console.error('Error saving report:', error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to save report",
      variant: "destructive",
    });
    return false;
  }
}
