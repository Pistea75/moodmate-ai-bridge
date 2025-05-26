
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AIPreferences, isValidAIPreferences } from "@/types/aiPersonalization";

export function usePersonalization(baseSystemPrompt: string) {
  const { user } = useAuth();
  const [personalizedSystemPrompt, setPersonalizedSystemPrompt] = useState(baseSystemPrompt);

  useEffect(() => {
    const fetchAIPersonalization = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('ai_patient_profiles')
          .select('preferences')
          .eq('patient_id', user.id)
          .maybeSingle();

        if (profile?.preferences && isValidAIPreferences(profile.preferences)) {
          const prefs = profile.preferences as AIPreferences;
          const customSystemPrompt = `
${baseSystemPrompt}

Patient Personalization:
- Known triggers to avoid: ${prefs.triggersToAvoid || 'N/A'}
- Recommended strategies: ${prefs.strategies || 'General CBT and mindfulness techniques'}
- Preferred tone: ${prefs.tone || 'supportive and evidence-based'}
- Patient motivators/interests: ${prefs.motivators || 'N/A'}
- Do's and Don'ts: ${prefs.dosAndDonts || 'Follow standard therapeutic guidelines'}

Instructions:
- Tailor your responses based on the patient's specific triggers and preferences
- Recommend the personalized strategies when appropriate
- Maintain the preferred tone throughout the conversation
- Always be empathetic and professional
          `.trim();
          
          setPersonalizedSystemPrompt(customSystemPrompt);
        }
      } catch (error) {
        console.error('Error fetching AI personalization:', error);
      }
    };

    fetchAIPersonalization();
  }, [user, baseSystemPrompt]);

  return personalizedSystemPrompt;
}
