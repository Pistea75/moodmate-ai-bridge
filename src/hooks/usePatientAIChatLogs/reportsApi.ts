
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
