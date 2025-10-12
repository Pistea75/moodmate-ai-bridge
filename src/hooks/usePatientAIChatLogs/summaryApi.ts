
import { toast } from "@/components/ui/use-toast";
import { LogEntry } from "./types";
import { supabase } from "@/integrations/supabase/client";

/**
 * Generate summary of chat logs using OpenAI
 * patientId and privacyLevel are optional but recommended for proper privacy controls
 */
export async function generateChatSummary(
  logs: LogEntry[], 
  patientId?: string,
  privacyLevel?: 'private' | 'partial_share' | 'full_share'
): Promise<string | null> {
  try {
    // If patientId is provided, fetch their actual privacy level
    let actualPrivacyLevel = privacyLevel || 'partial_share';
    
    if (patientId) {
      const { data: subscriberData } = await supabase
        .from('subscribers')
        .select('privacy_level')
        .eq('user_id', patientId)
        .maybeSingle();
      
      if (subscriberData?.privacy_level) {
        actualPrivacyLevel = subscriberData.privacy_level;
      }
    }

    // Format the logs for the OpenAI API
    const formattedLogs = logs.map(log => ({
      role: log.role,
      content: log.message,
    }));

    // Call the Edge Function using supabase client with privacy level
    const { data, error } = await supabase.functions.invoke('summarize-chat', {
      body: { 
        messages: formattedLogs,
        patientId,
        privacyLevel: actualPrivacyLevel
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to generate summary');
    }

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
