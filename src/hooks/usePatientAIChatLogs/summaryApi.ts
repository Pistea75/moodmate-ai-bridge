
import { toast } from "@/components/ui/use-toast";
import { LogEntry } from "./types";
import { supabase } from "@/integrations/supabase/client";

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

    // Call the Edge Function using supabase client
    const { data, error } = await supabase.functions.invoke('summarize-chat', {
      body: { messages: formattedLogs },
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
