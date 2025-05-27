
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
          
          // Enhanced system prompt with comprehensive personalization
          const customSystemPrompt = `
${baseSystemPrompt}

Patient Personalization Context:
- Diagnosis: ${(prefs as any).diagnosis || prefs.tone || 'Not specified'}
- Personality Traits: ${(prefs as any).personality_traits || prefs.motivators || 'Not specified'}
- Helpful Strategies: ${(prefs as any).helpful_strategies || prefs.strategies || 'General CBT and mindfulness techniques'}
- Things to Avoid: ${(prefs as any).things_to_avoid || prefs.triggersToAvoid || 'N/A'}
- Clinical Goals: ${(prefs as any).clinical_goals || prefs.dosAndDonts || 'Not specified'}

Latest mood context: Fetch and incorporate recent mood triggers when responding.

Instructions:
- Tailor your responses based on the patient's specific diagnosis and personality traits
- Recommend the personalized strategies when appropriate
- Actively avoid topics or approaches mentioned in "things to avoid"
- Keep clinical goals in mind when providing guidance
- Be especially attentive to the patient's unique personality and adapt your communication style accordingly
- Always be empathetic, professional, and evidence-based
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
