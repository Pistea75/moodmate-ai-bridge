import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export function useAILearning() {
  const { user } = useAuth();
  const { toast } = useToast();

  const triggerManualLearning = async (
    patientId: string,
    conversationMessages: ConversationMessage[]
  ) => {
    if (!user || !patientId || conversationMessages.length === 0) {
      console.log('Missing required data for manual learning trigger');
      return;
    }

    try {
      // Check if user is a clinician with access to this patient
      const { data: linkData } = await supabase
        .from('patient_clinician_links')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinician_id', user.id)
        .single();

      if (!linkData) {
        console.error('No clinician-patient link found for manual learning');
        return;
      }

      console.log('Triggering manual AI learning for patient:', patientId);

      // Call the AI learning edge function
      const { data, error } = await supabase.functions.invoke('ai-learning', {
        body: {
          patientId: patientId,
          clinicianId: user.id,
          conversationMessages: conversationMessages
        }
      });

      if (error) {
        console.error('Error calling AI learning function:', error);
        toast({
          title: "Error en aprendizaje de IA",
          description: "Hubo un problema al analizar la conversación.",
          variant: "destructive",
        });
        return;
      }

      if (data?.newPreferences && Object.keys(data.newPreferences).length > 0) {
        toast({
          title: "IA ha aprendido nuevas preferencias",
          description: "Las configuraciones de IA se han actualizado automáticamente.",
          duration: 5000,
        });
        
        return data.updatedPreferences;
      } else {
        console.log('No new preferences learned from manual trigger');
      }

    } catch (error) {
      console.error('Error in manual AI learning:', error);
      toast({
        title: "Error en aprendizaje de IA",
        description: "Hubo un error inesperado durante el análisis.",
        variant: "destructive",
      });
    }
  };

  return { triggerManualLearning };
}