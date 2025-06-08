
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: messages must be an array' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const systemPrompt = `
      You are a clinical assistant helping a mental health professional understand a patient-AI chat session.
      
      Provide a comprehensive analysis of the conversation with the following structure:

      ## Session Overview
      Briefly describe the main topics discussed and the patient's general presentation during the session.

      ## Main Emotional Themes  
      - Identify and elaborate on the primary emotional patterns
      - Note any significant mood changes throughout the conversation
      - Highlight recurring emotional concerns

      ## Cognitive Distortions
      - List any cognitive distortions identified (catastrophizing, all-or-nothing thinking, etc.)
      - Provide specific examples from the conversation
      - Note patterns of negative thought processes

      ## Suggested Coping Strategies
      - Recommend evidence-based interventions based on the conversation content
      - Suggest specific CBT techniques that could be helpful
      - Provide actionable strategies the patient can implement

      ## Warning Signs or Concerns
      - Flag any concerning statements or behaviors
      - Note if immediate clinical attention may be needed
      - Highlight any safety concerns or risk factors

      ## Progress and Insights
      - Document any breakthrough moments or insights
      - Note areas where the patient showed growth or understanding
      - Identify strengths and positive coping mechanisms displayed

      ## Recommendations for Next Session
      - Suggest topics to explore further
      - Recommend specific therapeutic interventions
      - Note any homework or exercises that might be beneficial

      Be thorough, professional, and clinical in your analysis. Use specific examples from the conversation when possible.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Please analyze the following patient-AI chat conversation and provide a comprehensive clinical summary:\n\n${JSON.stringify(messages, null, 2)}` }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'OpenAI API error');
    }
    
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in summarize-chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate summary' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
