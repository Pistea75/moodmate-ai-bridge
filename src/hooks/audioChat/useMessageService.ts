
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useMessageService() {
  const { toast } = useToast();
  const { user } = useAuth();

  const saveMessageToDatabase = async (role: 'user' | 'assistant', message: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('ai_chat_logs')
        .insert({
          patient_id: user.id,
          role: role,
          message: message
        });
        
      if (error) {
        console.error("Error saving message to database:", error);
      }
    } catch (error) {
      console.error("Error in saveMessageToDatabase:", error);
    }
  };

  return { saveMessageToDatabase };
}
