import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { patient_id, preferences } = await req.json();

    if (!patient_id || !preferences) {
      return new Response(JSON.stringify({ error: 'patient_id and preferences are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('AI personalization request for patient:', patient_id);

    // Verify clinician has access to this patient
    const { data: patientLink } = await supabase
      .from('patient_clinician_links')
      .select('*')
      .eq('clinician_id', user.id)
      .eq('patient_id', patient_id)
      .single();

    if (!patientLink) {
      return new Response(JSON.stringify({ error: 'Access denied to this patient' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get patient information for context
    const { data: patient } = await supabase
      .from('profiles')
      .select('first_name, last_name, treatment_goals, initial_assessment')
      .eq('id', patient_id)
      .single();

    // Get recent patient data for AI optimization
    const [moodData, chatData, taskData] = await Promise.all([
      supabase.from('mood_entries').select('*').eq('patient_id', patient_id).order('created_at', { ascending: false }).limit(10),
      supabase.from('ai_chat_logs').select('*').eq('patient_id', patient_id).order('created_at', { ascending: false }).limit(20),
      supabase.from('tasks').select('*').eq('patient_id', patient_id).order('inserted_at', { ascending: false }).limit(10)
    ]);

    // Use AI to optimize and validate the personalization settings
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (openaiApiKey) {
      const optimizationPrompt = `You are an expert clinical psychologist AI. A clinician wants to personalize AI interactions for their patient. Please analyze and optimize these settings:

PATIENT INFORMATION:
- Name: ${patient?.first_name} ${patient?.last_name}
- Treatment Goals: ${patient?.treatment_goals || 'Not specified'}
- Initial Assessment: ${patient?.initial_assessment || 'Not available'}

RECENT PATIENT DATA:
- Recent mood scores: ${moodData.data?.map(m => m.mood_score).join(', ') || 'None'}
- Recent chat themes: ${chatData.data?.slice(0, 5).map(c => c.message.substring(0, 50)).join('; ') || 'None'}
- Task completion rate: ${taskData.data ? `${taskData.data.filter(t => t.completed).length}/${taskData.data.length}` : 'N/A'}

CLINICIAN'S PROPOSED SETTINGS:
${JSON.stringify(preferences, null, 2)}

Please provide optimized recommendations in JSON format:
{
  "validated_preferences": {
    "communication_style": "specific recommendations",
    "therapeutic_approach": "evidence-based approach selection",
    "specific_instructions": "tailored clinical instructions",
    "crisis_protocols": "specific crisis intervention steps",
    "motivation_techniques": "personalized motivation strategies",
    "trigger_awareness": "identified patient triggers to be mindful of",
    "strength_focus": "patient strengths to emphasize",
    "language_preferences": "tone and language recommendations",
    "intervention_timing": "optimal timing for different interventions"
  },
  "ai_optimization_notes": "professional insights for AI behavior",
  "clinical_recommendations": "suggestions for the clinician",
  "risk_considerations": "important safety considerations",
  "effectiveness_metrics": "how to measure success of these settings"
}

Base your recommendations on evidence-based practice and the patient's specific needs.`;

      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4.1-2025-04-14',
            messages: [
              { role: 'system', content: optimizationPrompt },
              { role: 'user', content: JSON.stringify(preferences) }
            ],
            temperature: 0.3,
            max_tokens: 2000,
          }),
        });

        const aiResponse = await response.json();
        const optimizedSettings = JSON.parse(aiResponse.choices[0].message.content);

        // Store the optimized AI personalization settings
        const { data: aiProfile, error: upsertError } = await supabase
          .from('ai_patient_profiles')
          .upsert({
            patient_id: patient_id,
            clinician_id: user.id,
            preferences: optimizedSettings.validated_preferences,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        console.log('AI personalization saved:', aiProfile);

        return new Response(JSON.stringify({
          success: true,
          ai_profile: aiProfile,
          optimization_results: optimizedSettings,
          patient_name: `${patient?.first_name} ${patient?.last_name}`,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (aiError) {
        console.error('AI optimization failed, saving original preferences:', aiError);
        
        // Fallback to saving original preferences if AI optimization fails
        const { data: aiProfile, error: upsertError } = await supabase
          .from('ai_patient_profiles')
          .upsert({
            patient_id: patient_id,
            clinician_id: user.id,
            preferences: preferences,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (upsertError) {
          throw upsertError;
        }

        return new Response(JSON.stringify({
          success: true,
          ai_profile: aiProfile,
          note: 'AI optimization unavailable, saved original preferences',
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

  } catch (error) {
    console.error('Error in AI personalization function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});