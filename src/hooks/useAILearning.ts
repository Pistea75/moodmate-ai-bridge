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

  const learnFromConversation = async (
    patientId: string,
    conversationMessages: ConversationMessage[]
  ) => {
    if (!user || !patientId || conversationMessages.length === 0) return;

    try {
      // Check if user is a clinician with access to this patient
      const { data: linkData } = await supabase
        .from('patient_clinician_links')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinician_id', user.id)
        .single();

      if (!linkData) {
        console.error('No clinician-patient link found');
        return;
      }

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
        return;
      }

      if (data?.newPreferences && Object.keys(data.newPreferences).length > 0) {
        toast({
          title: "IA ha aprendido nuevas preferencias",
          description: "Las configuraciones de IA se han actualizado automáticamente basándose en la conversación.",
          duration: 5000,
        });
        
        return data.updatedPreferences;
      }

    } catch (error) {
      console.error('Error in AI learning:', error);
    }
  };

  return { learnFromConversation };
}