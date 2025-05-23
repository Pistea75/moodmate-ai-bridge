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
  
  // Convert patientId to string explicitly if it's not already
  const patientIdStr = String(patientId).trim();
  
  console.log('Patient ID being used for query:', patientIdStr);
  console.log('Patient ID type:', typeof patientIdStr);
  
  // Validate the UUID format
  console.log('Is valid UUID format:', uuidRegex.test(patientIdStr));
  if (!uuidRegex.test(patientIdStr)) {
    console.warn('Invalid patient UUID format:', patientIdStr);
    toast({
      title: "Warning",
      description: "Patient ID format is invalid. This may cause issues with data retrieval.",
      variant: "destructive",
    });
  }
  
  try {
    console.log('Fetching logs for patient:', patientIdStr);
    
    // TEMPORARY DEBUGGING: Look for ANY logs in the entire ai_chat_logs table to check if the table has data
    const { count: totalLogsInTable, error: totalLogsError } = await supabase
      .from('ai_chat_logs')
      .select('*', { count: 'exact', head: true });
      
    console.log(`Total logs in the entire ai_chat_logs table: ${totalLogsInTable || 0}`);
    
    if (totalLogsError) {
      console.error('Error checking total logs in table:', totalLogsError);
    }
    
    // Now check if any logs exist specifically for this patient
    const { count: totalCount, error: countError } = await supabase
      .from('ai_chat_logs')
      .select('*', { count: 'exact', head: true })
      .eq('patient_id', patientIdStr);
    
    console.log(`Total logs for patient ${patientIdStr} (ignoring filters): ${totalCount || 0}`);
    
    if (countError) {
      console.error('Error checking total logs for patient:', countError);
    }
    
    // Build the base query
    let query = supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', patientIdStr)
      .order('created_at', { ascending: true });
    
    // Apply date filters if active
    if (isFilterActive && startDate && endDate) {
      // Normalize to UTC for consistent filtering
      const startUTC = new Date(startDate);
      startUTC.setUTCHours(0, 0, 0, 0);
      
      const endUTC = new Date(endDate);
      endUTC.setUTCHours(23, 59, 59, 999);
      
      console.log('Filtering logs with startDate (UTC):', startUTC.toISOString());
      console.log('Filtering logs with endDate (UTC):', endUTC.toISOString());
      
      query = query
        .gte('created_at', startUTC.toISOString())
        .lte('created_at', endUTC.toISOString());
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
      
      return [];
    }

    console.log(`Chat logs fetched: ${data?.length || 0}`);
    
    if (data && data.length > 0) {
      console.log('First few logs:', data.slice(0, Math.min(3, data.length)));
      
      // Sanitize the data to ensure the role property conforms to LogEntry type
      return data.map(log => ({
        ...log,
        role: log.role === 'assistant' ? 'assistant' : 'user'
      })) as LogEntry[];
    } 
    
    console.log('No logs found for this patient, trying alternative approaches...');
    
    // Also try a raw SQL query via RPC function (if possible)
    try {
      // Use try-catch since the function may not exist and we don't want to error out
      const { data: rawQueryData, error: rawQueryError } = await supabase.rpc(
        'get_patient_mood_summaries', 
        { clinician_uuid: patientIdStr }
      );
      
      if (!rawQueryError && rawQueryData) {
        console.log('Raw query results:', rawQueryData);
      } else if (rawQueryError) {
        console.log('Raw query error (expected if function does not exist):', rawQueryError);
      }
    } catch (e) {
      // Expected to fail if the function doesn't exist
      console.log('Raw query function does not exist (expected)');
    }
    
    // As a last resort, try fetching without patient_id equality check (debugging only)
    const { data: allLogsData, error: allLogsError } = await supabase
      .from('ai_chat_logs')
      .select('patient_id, role, message, created_at')
      .limit(10);
      
    if (!allLogsError && allLogsData && allLogsData.length > 0) {
      console.log('Sample of logs in the table:', allLogsData);
      console.log('Patient IDs in the sample:', allLogsData.map(log => log.patient_id));
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
