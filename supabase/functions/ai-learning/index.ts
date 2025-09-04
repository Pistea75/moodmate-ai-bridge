import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningRequest {
  patientId: string;
  clinicianId: string;
  conversationMessages: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Create client with anon key for proper JWT verification
    const clientSupabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    
    // Verify the user's session using the client
    const { data: { user }, error: authError } = await clientSupabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { patientId, clinicianId, conversationMessages }: LearningRequest = await req.json();

    // Validate input
    if (!patientId || !clinicianId || !conversationMessages) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`AI Learning request from user ${user.id} for patient ${patientId}`);

    // Verify user is the clinician
    if (user.id !== clinicianId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify clinician has access to patient
    const { data: linkData, error: linkError } = await supabaseClient
      .from('patient_clinician_links')
      .select('*')
      .eq('patient_id', patientId)
      .eq('clinician_id', clinicianId)
      .single();

    if (linkError || !linkData) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized access to patient data' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Clinician-patient link verified for patient ${patientId} and clinician ${clinicianId}`);

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get current AI preferences
    const { data: currentProfile } = await supabaseClient
      .from('ai_patient_profiles')
      .select('preferences')
      .eq('patient_id', patientId)
      .maybeSingle();

    const currentPreferences = currentProfile?.preferences || {};

    // Create conversation context for analysis
    const conversationText = conversationMessages
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    // Analyze conversation for new preferences
    const analysisPrompt = `Analyze this conversation between a clinician and an AI assistant where the clinician is configuring AI preferences for their patient. Extract any new or updated AI personalization preferences.

Current AI preferences:
${JSON.stringify(currentPreferences, null, 2)}

Conversation:
${conversationText}

Please identify:
1. Preferred tone changes or specifications
2. New coping strategies to recommend
3. Triggers to avoid that weren't mentioned before
4. New motivators or interests
5. Updated do's and don'ts for AI behavior
6. Diagnosis or personality trait updates
7. Clinical goals modifications

Return ONLY a JSON object with the updated preferences that should be merged with existing ones. Include only fields that have new information or updates. Use this exact format:
{
  "tone": "string or null",
  "strategies": "string or null", 
  "triggersToAvoid": "string or null",
  "motivators": "string or null",
  "dosAndDonts": "string or null",
  "diagnosis": "string or null",
  "personality_traits": "string or null",
  "helpful_strategies": "string or null",
  "things_to_avoid": "string or null",
  "clinical_goals": "string or null",
  "learned_from_conversation": true,
  "last_learning_date": "${new Date().toISOString()}"
}

If no new preferences are detected, return an empty object: {}`;

    // Call OpenAI for analysis
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an expert at analyzing clinical conversations to extract AI personalization preferences. Always return valid JSON.' },
          { role: 'user', content: analysisPrompt }
        ],
        max_tokens: 1000,
        temperature: 0.1,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI analysis service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const analysisResult = openaiData.choices[0]?.message?.content || '{}';

    console.log('AI Analysis Result:', analysisResult);

    let newPreferences = {};
    try {
      newPreferences = JSON.parse(analysisResult);
      console.log('Parsed new preferences:', newPreferences);
    } catch (error) {
      console.error('Error parsing AI analysis result:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI analysis' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only update if there are new preferences
    if (Object.keys(newPreferences).length === 0) {
      console.log('No new preferences detected, skipping update');
      return new Response(
        JSON.stringify({ 
          message: 'No new preferences detected',
          preferences: currentPreferences 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Updating preferences with new data:', newPreferences);

    // Merge with existing preferences
    const updatedPreferences = { ...currentPreferences, ...newPreferences };

    // Save updated preferences
    const { data: existing } = await supabaseClient
      .from('ai_patient_profiles')
      .select('id')
      .eq('patient_id', patientId)
      .maybeSingle();

    const payload = {
      patient_id: patientId,
      clinician_id: clinicianId,
      preferences: updatedPreferences
    };

    const { error: saveError } = existing
      ? await supabaseClient
          .from('ai_patient_profiles')
          .update(payload)
          .eq('patient_id', patientId)
      : await supabaseClient
          .from('ai_patient_profiles')
          .insert([payload]);

    if (saveError) {
      console.error('Error saving learned preferences:', saveError);
      return new Response(
        JSON.stringify({ error: 'Failed to save learned preferences' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        message: 'Successfully learned new AI preferences',
        newPreferences: newPreferences,
        updatedPreferences: updatedPreferences
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});