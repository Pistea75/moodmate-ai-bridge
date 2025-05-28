
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { 
  isExerciseRecommendation, 
  isUserConfirmation, 
  isUserDenial,
  extractExerciseFromText 
} from "@/lib/ai/exerciseDetection";
import { logExercise, markExerciseCompleted } from "@/lib/ai/exerciseLogging";

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
        throw new Error(`Failed to save message: ${error.message}`);
      }

      // Handle exercise tracking logic
      if (role === 'assistant' && isExerciseRecommendation(message)) {
        const exerciseText = extractExerciseFromText(message);
        await logExercise(user.id, exerciseText);
      }

      if (role === 'user') {
        if (isUserConfirmation(message)) {
          await markExerciseCompleted(user.id, true);
        } else if (isUserDenial(message)) {
          await markExerciseCompleted(user.id, false);
        }
      }
        
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving message',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return { saveMessageToDatabase };
}
