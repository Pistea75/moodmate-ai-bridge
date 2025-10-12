
import { toast } from '@/components/ui/use-toast';
import { LogEntry } from './types';
import { fetchPatientChatLogs, checkForLogsOutsideFilter } from './api';

/**
 * Fetch logs for a patient with optional date filtering
 */
export async function fetchLogsLogic(
  patientId: string,
  startDate: Date | null,
  endDate: Date | null,
  isFilterActive: boolean
): Promise<LogEntry[]> {
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
  
  // If filter is active, fetch with date filter directly
  if (isFilterActive && startDate && endDate) {
    console.log('Applying date filter...');
    fetchedLogs = await fetchPatientChatLogs(
      patientId, 
      startDate, 
      endDate, 
      true
    );
    
    console.log('Filtered logs fetched, count:', fetchedLogs.length);
    
    if (fetchedLogs.length === 0) {
      console.log('No logs in filtered range');
      toast({
        title: "No logs in date range",
        description: `No logs found in the selected date range.`,
      });
    }
  }
  
  return fetchedLogs;
}
