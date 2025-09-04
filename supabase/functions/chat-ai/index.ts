
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

    // Extract the JWT token
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the user's session using service role for proper authentication
    const { data: { user }, error: authError } = await supabaseClient.auth.admin.getUserById(token);
    
    if (authError || !user) {
      // Try alternative method using anon key
      const clientSupabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? ''
      );
      
      const { data: { user: clientUser }, error: clientAuthError } = await clientSupabase.auth.getUser(token);
      
      if (clientAuthError || !clientUser) {
        console.error('Authentication error:', authError || clientAuthError);
        return new Response(
          JSON.stringify({ error: 'Invalid authentication' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Use the authenticated user from client
      user = clientUser;
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

    // Auto-query AI patient profile for personalization
    let aiProfile = null;
    const targetPatientId = patientId || user.id;
    
    try {
      const { data: profileData } = await supabaseClient
        .from('ai_patient_profiles')
        .select('preferences')
        .eq('patient_id', targetPatientId)
        .maybeSingle();
      
      if (profileData?.preferences) {
        aiProfile = profileData.preferences;
      }
    } catch (error) {
      console.error('Error fetching AI profile:', error);
    }

    // Get patient context data for better responses
    let patientContext = '';
    if (targetPatientId) {
      try {
        // Get recent mood entries
        const { data: moodData } = await supabaseClient
          .from('mood_entries')
          .select('mood_score, triggers, created_at')
          .eq('patient_id', targetPatientId)
          .order('created_at', { ascending: false })
          .limit(3);

        // Get pending tasks
        const { data: taskData } = await supabaseClient
          .from('tasks')
          .select('title, completed, due_date')
          .eq('patient_id', targetPatientId)
          .eq('completed', false)
          .limit(5);

        if (moodData && moodData.length > 0) {
          const avgMood = moodData.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.length;
          patientContext += `\nRecent mood context: Average mood ${avgMood.toFixed(1)}/10 over last ${moodData.length} entries.`;
          
          const recentTriggers = moodData.flatMap(entry => entry.triggers || []).filter(Boolean);
          if (recentTriggers.length > 0) {
            patientContext += ` Recent triggers: ${recentTriggers.slice(0, 3).join(', ')}.`;
          }
        }

        if (taskData && taskData.length > 0) {
          patientContext += `\nPending tasks: ${taskData.length} incomplete tasks.`;
        }
      } catch (error) {
        console.error('Error fetching patient context:', error);
      }
    }

    // Build system prompt with AI personalization
    let systemPrompt = `You are a helpful, empathetic AI assistant specializing in mental health support. 
    You provide compassionate, evidence-based guidance while maintaining professional boundaries.
    
    IMPORTANT: You can receive messages from users both as typed text and as voice messages that have been 
    transcribed to text using speech-to-text technology. Treat both types of input equals and respond 
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

    // Add AI personalization if available
    if (aiProfile) {
      systemPrompt += `\n\nPersonalization Profile:`;
      if (aiProfile.tone) systemPrompt += `\n- Preferred tone: ${aiProfile.tone}`;
      if (aiProfile.strategies) systemPrompt += `\n- Recommended coping strategies: ${aiProfile.strategies}`;
      if (aiProfile.triggersToAvoid) systemPrompt += `\n- Important triggers to avoid: ${aiProfile.triggersToAvoid}`;
      if (aiProfile.motivators) systemPrompt += `\n- Patient motivators/interests: ${aiProfile.motivators}`;
      if (aiProfile.dosAndDonts) systemPrompt += `\n- Do's and Don'ts: ${aiProfile.dosAndDonts}`;
      if (aiProfile.diagnosis) systemPrompt += `\n- Diagnosis context: ${aiProfile.diagnosis}`;
      if (aiProfile.personality_traits) systemPrompt += `\n- Personality traits: ${aiProfile.personality_traits}`;
      if (aiProfile.helpful_strategies) systemPrompt += `\n- Helpful strategies: ${aiProfile.helpful_strategies}`;
      if (aiProfile.things_to_avoid) systemPrompt += `\n- Things to avoid: ${aiProfile.things_to_avoid}`;
      if (aiProfile.clinical_goals) systemPrompt += `\n- Clinical goals: ${aiProfile.clinical_goals}`;
    }

    // Add patient context
    if (patientContext) {
      systemPrompt += `\n\nCurrent Patient Context:${patientContext}`;
    }

    // Add legacy personality support
    if (aiPersonality) {
      systemPrompt += `\n\nAdditional instructions from the clinician:\n${aiPersonality}`;
    }

    // Detect if this is a clinician configuring AI for a patient
    const isClinicianConfiguring = clinicianId && patientId && user.id === clinicianId;
    if (isClinicianConfiguring) {
      systemPrompt += `\n\nSPECIAL MODE: You are helping a clinician configure AI preferences for their patient. 
      Listen for instructions about how to interact with the patient and extract key personalization preferences. 
      When the clinician gives specific instructions (e.g., "always use a calm tone" or "avoid discussing work stress"), 
      note these as important configuration details.`;
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

    // Log the conversation (with data minimization) and trigger AI learning if needed
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

    // If this is a clinician configuring AI, trigger learning analysis (non-blocking)
    if (isClinicianConfiguring) {
      const conversationMessages = [
        { role: 'user', content: messages[messages.length - 1].content },
        { role: 'assistant', content: aiResponse }
      ];
      
      // Call AI learning function asynchronously with proper auth
      supabaseClient.functions.invoke('ai-learning', {
        headers: {
          Authorization: authHeader,
        },
        body: {
          patientId: patientId,
          clinicianId: clinicianId,
          conversationMessages: conversationMessages
        }
      }).catch(error => {
        console.error('AI learning error:', error);
      });
    }

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
