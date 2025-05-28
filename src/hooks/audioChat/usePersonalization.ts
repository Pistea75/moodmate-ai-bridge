
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { AIPreferences, isValidAIPreferences } from "@/types/aiPersonalization";
import { hasUnconfirmedExercise, getLatestPendingExercise } from "@/lib/ai/exerciseLogging";

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

        // Check for pending exercises
        const hasPendingExercise = await hasUnconfirmedExercise(user.id);
        const pendingExercise = hasPendingExercise ? await getLatestPendingExercise(user.id) : null;

        let personalizationContext = '';
        if (profile?.preferences && isValidAIPreferences(profile.preferences)) {
          const prefs = profile.preferences as AIPreferences;
          
          personalizationContext = `
Patient Personalization Context:
- Diagnosis: ${(prefs as any).diagnosis || prefs.tone || 'Not specified'}
- Personality Traits: ${(prefs as any).personality_traits || prefs.motivators || 'Not specified'}
- Helpful Strategies: ${(prefs as any).helpful_strategies || prefs.strategies || 'General CBT and mindfulness techniques'}
- Things to Avoid: ${(prefs as any).things_to_avoid || prefs.triggersToAvoid || 'N/A'}
- Clinical Goals: ${(prefs as any).clinical_goals || prefs.dosAndDonts || 'Not specified'}
`;
        }

        let exerciseContext = '';
        if (hasPendingExercise && pendingExercise) {
          exerciseContext = `
Exercise Follow-up Context:
- There is a pending exercise: "${pendingExercise}"
- IMPORTANT: Ask the patient if they were able to try this exercise
- If they confirm they tried it, celebrate their progress
- If they say they didn't, offer gentle encouragement and perhaps suggest an alternative
- Listen for confirmation keywords like "I tried it", "I did it", "yes I completed", etc.
`;
        } else {
          exerciseContext = `
Exercise Recommendation Guidelines:
- When appropriate, suggest evidence-based coping strategies or exercises
- Use clear, actionable language like "Try this breathing technique" or "Practice this grounding exercise"
- Keep recommendations simple and achievable
- Examples: breathing exercises, grounding techniques, mindfulness practices, journaling prompts
`;
        }

        // Enhanced system prompt with comprehensive personalization and exercise tracking
        const customSystemPrompt = `
${baseSystemPrompt}

${personalizationContext}

${exerciseContext}

Latest mood context: Fetch and incorporate recent mood triggers when responding.

Instructions:
- Tailor your responses based on the patient's specific diagnosis and personality traits
- Recommend personalized strategies when appropriate
- Actively avoid topics or approaches mentioned in "things to avoid"
- Keep clinical goals in mind when providing guidance
- Be especially attentive to the patient's unique personality and adapt your communication style accordingly
- Always be empathetic, professional, and evidence-based
- Track exercise recommendations and follow up on completion
          `.trim();
          
          setPersonalizedSystemPrompt(customSystemPrompt);
      } catch (error) {
        console.error('Error fetching AI personalization:', error);
      }
    };

    fetchAIPersonalization();
  }, [user, baseSystemPrompt]);

  return personalizedSystemPrompt;
}
