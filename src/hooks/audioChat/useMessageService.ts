
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

  const saveMessageToDatabase = async (role: 'user' | 'assistant', message: string, patientId?: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('ai_chat_logs')
        .insert({
          patient_id: patientId || user.id,
          role: role,
          message: message
        });
        
      if (error) {
        throw new Error(`Failed to save message: ${error.message}`);
      }

      // Handle exercise tracking logic only for new messages
      const targetPatientId = patientId || user.id;
      if (role === 'assistant' && isExerciseRecommendation(message)) {
        const exerciseText = extractExerciseFromText(message);
        await logExercise(targetPatientId, exerciseText);
      }

      if (role === 'user') {
        if (isUserConfirmation(message)) {
          await markExerciseCompleted(targetPatientId, true);
        } else if (isUserDenial(message)) {
          await markExerciseCompleted(targetPatientId, false);
        }
      }
        
    } catch (error) {
      console.error('Error saving message:', error);
      toast({
        variant: 'destructive',
        title: 'Error saving message',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }
  };

  return { saveMessageToDatabase };
}
