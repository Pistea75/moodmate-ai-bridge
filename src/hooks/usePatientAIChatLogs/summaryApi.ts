
import { toast } from "@/components/ui/use-toast";
import { LogEntry } from "./types";

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
