
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  messages: ChatMessage[];
  patientId?: string;
  clinicianId?: string;
  aiPersonality?: any;
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

    // Verify the user's session
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages, patientId, clinicianId, aiPersonality }: ChatRequest = await req.json();

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid messages format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate user permissions
    if (patientId && user.id !== patientId) {
      // Check if user is a clinician authorized to access this patient
      const { data: linkData, error: linkError } = await supabaseClient
        .from('patient_clinician_links')
        .select('*')
        .eq('patient_id', patientId)
        .eq('clinician_id', user.id)
        .single();

      if (linkError || !linkData) {
        console.error('Authorization error:', linkError);
        return new Response(
          JSON.stringify({ error: 'Unauthorized access to patient data' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Rate limiting check
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    const { data: recentRequests, error: rateError } = await supabaseClient
      .from('ai_chat_logs')
      .select('id')
      .eq('patient_id', patientId || user.id)
      .gte('created_at', oneMinuteAgo.toISOString())
      .limit(10);

    if (rateError) {
      console.error('Rate limit check error:', rateError);
    } else if (recentRequests && recentRequests.length >= 10) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait before sending more messages.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not found');
      return new Response(
        JSON.stringify({ error: 'AI service configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build system prompt with AI personalization
    let systemPrompt = `You are a helpful, empathetic AI assistant specializing in mental health support. 
    You provide compassionate, evidence-based guidance while maintaining professional boundaries.
    
    IMPORTANT: You can receive messages from users both as typed text and as voice messages that have been 
    transcribed to text using speech-to-text technology. Treat both types of input equally and respond 
    naturally to the content, regardless of whether it was originally spoken or typed.
    
    Important guidelines:
    - Always maintain a supportive and non-judgmental tone
    - Provide practical, actionable advice when appropriate
    - If someone expresses thoughts of self-harm, encourage them to seek immediate professional help
    - Respect privacy and confidentiality
    - Stay within your scope as an AI assistant, not a replacement for professional therapy
    - Keep responses concise but thorough
    - Use person-first language when discussing mental health
    - Accept and respond to voice messages that have been converted to text`;

    if (aiPersonality) {
      systemPrompt += `\n\nPersonalized instructions from the clinician:\n${aiPersonality}`;
    }

    // Prepare messages for OpenAI with input sanitization
    const sanitizedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content.replace(/<script.*?<\/script>/gi, '').replace(/javascript:/gi, '').slice(0, 4000)
      }))
    ];

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: sanitizedMessages,
        max_tokens: 1000,
        temperature: 0.7,
        frequency_penalty: 0.3,
        presence_penalty: 0.3,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

    // Log the conversation (with data minimization)
    const logPromises = [
      // Log user message
      supabaseClient.from('ai_chat_logs').insert({
        patient_id: patientId || user.id,
        role: 'user',
        message: messages[messages.length - 1].content.slice(0, 1000), // Truncate for storage
        created_at: new Date().toISOString(),
      }),
      // Log AI response
      supabaseClient.from('ai_chat_logs').insert({
        patient_id: patientId || user.id,
        role: 'assistant',
        message: aiResponse.slice(0, 1000), // Truncate for storage
        created_at: new Date().toISOString(),
      }),
    ];

    // Execute logging (don't await to avoid blocking response)
    Promise.all(logPromises).catch(error => {
      console.error('Logging error:', error);
    });

    return new Response(
      JSON.stringify({ 
        message: aiResponse,
        usage: openaiData.usage 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        } 
      }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
