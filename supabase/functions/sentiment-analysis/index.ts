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

    const { text, context = {} } = await req.json();

    if (!text) {
      return new Response(JSON.stringify({ error: 'Text is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Sentiment analysis request:', text);

    // Get recent context for better analysis
    const { data: recentMoods } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: chatHistory } = await supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Advanced sentiment analysis with psychological insights
    const analysisPrompt = `You are an expert clinical psychologist AI. Analyze the following text for detailed emotional and psychological insights:

TEXT TO ANALYZE: "${text}"

RECENT CONTEXT:
- Recent mood scores: ${recentMoods?.map(m => `${m.mood_score}/10`).join(', ') || 'None'}
- Recent chat themes: ${chatHistory?.slice(0, 5).map(c => c.message.substring(0, 50)).join('; ') || 'None'}

Provide a comprehensive analysis in JSON format with:
{
  "primary_emotion": "dominant emotion detected",
  "secondary_emotions": ["list", "of", "other", "emotions"],
  "sentiment_score": number_between_-1_and_1,
  "emotional_intensity": number_between_0_and_10,
  "psychological_themes": ["cognitive_patterns", "behavioral_indicators"],
  "risk_indicators": ["any_concerning_patterns"],
  "therapeutic_opportunities": ["suggested_interventions"],
  "cognitive_distortions": ["identified_thinking_patterns"],
  "coping_mechanisms": ["observed_or_suggested_strategies"],
  "mood_trend_impact": "how_this_relates_to_recent_mood_pattern",
  "recommended_response_tone": "how_ai_should_respond",
  "crisis_level": "none|low|medium|high",
  "specific_triggers": ["identified_emotional_triggers"],
  "strengths_observed": ["positive_aspects_or_resources"]
}

Be precise, clinical, and evidence-based in your analysis.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: analysisPrompt },
          { role: 'user', content: text }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    const aiResponse = await response.json();
    let analysis;

    try {
      analysis = JSON.parse(aiResponse.choices[0].message.content);
    } catch (error) {
      // Fallback basic analysis if JSON parsing fails
      analysis = {
        primary_emotion: 'neutral',
        sentiment_score: 0,
        emotional_intensity: 5,
        crisis_level: 'none',
        error: 'Advanced analysis failed, using fallback'
      };
    }

    // Store sentiment analysis result for future reference
    await supabase.from('ai_chat_logs').insert({
      patient_id: user.id,
      role: 'system',
      message: `Sentiment Analysis: ${JSON.stringify(analysis)}`,
      created_at: new Date().toISOString(),
    });

    // Trigger alerts if high crisis level detected
    if (analysis.crisis_level === 'high') {
      // Find clinician for this patient
      const { data: clinicianLink } = await supabase
        .from('patient_clinician_links')
        .select('clinician_id')
        .eq('patient_id', user.id)
        .single();

      if (clinicianLink) {
        await supabase.from('notifications').insert({
          user_id: clinicianLink.clinician_id,
          type: 'crisis_alert',
          title: 'High Crisis Level Detected',
          description: `AI sentiment analysis detected high crisis indicators in patient communication.`,
          priority: 'high',
          metadata: {
            patient_id: user.id,
            crisis_level: analysis.crisis_level,
            primary_emotion: analysis.primary_emotion,
            risk_indicators: analysis.risk_indicators,
            analysis_timestamp: new Date().toISOString()
          }
        });
      }
    }

    return new Response(JSON.stringify({
      analysis,
      timestamp: new Date().toISOString(),
      user_id: user.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in sentiment analysis function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});