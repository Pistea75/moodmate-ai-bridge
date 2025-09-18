import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      }
    );

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Set the auth header for the request
    supabase.auth.setSession({
      access_token: authHeader.replace('Bearer ', ''),
      refresh_token: '',
    });

    const { patient_id } = await req.json();

    if (!patient_id) {
      return new Response(JSON.stringify({ error: 'patient_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Assessing risk for patient:', patient_id);

    // Get the current user (should be a clinician)
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch patient data for risk assessment
    const { data: moodEntries, error: moodError } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('patient_id', patient_id)
      .order('created_at', { ascending: false })
      .limit(30);

    const { data: chatLogs, error: chatError } = await supabase
      .from('ai_chat_logs')
      .select('*')
      .eq('patient_id', patient_id)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('*')
      .eq('patient_id', patient_id)
      .order('inserted_at', { ascending: false })
      .limit(20);

    if (moodError || chatError || tasksError) {
      console.error('Error fetching patient data:', { moodError, chatError, tasksError });
      return new Response(JSON.stringify({ error: 'Failed to fetch patient data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate risk score based on various factors
    let riskScore = 0;
    let riskLevel = 'low';
    let dataPoints = {};

    // Mood analysis
    if (moodEntries && moodEntries.length > 0) {
      const recentMoods = moodEntries.slice(0, 7); // Last 7 entries
      const avgMood = recentMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / recentMoods.length;
      const lowMoodCount = recentMoods.filter(entry => entry.mood_score <= 3).length;
      
      dataPoints.avgMood = avgMood;
      dataPoints.lowMoodCount = lowMoodCount;
      dataPoints.totalMoodEntries = moodEntries.length;

      if (avgMood <= 3) riskScore += 30;
      else if (avgMood <= 5) riskScore += 15;
      
      if (lowMoodCount >= 5) riskScore += 25;
      else if (lowMoodCount >= 3) riskScore += 15;
    }

    // Task completion analysis
    if (tasks && tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.completed).length;
      const completionRate = completedTasks / tasks.length;
      
      dataPoints.taskCompletionRate = completionRate;
      dataPoints.totalTasks = tasks.length;

      if (completionRate < 0.3) riskScore += 20;
      else if (completionRate < 0.6) riskScore += 10;
    }

    // Chat activity analysis
    if (chatLogs && chatLogs.length > 0) {
      const recentChats = chatLogs.slice(0, 10);
      const negativeConcerns = recentChats.filter(log => 
        log.message.toLowerCase().includes('sad') ||
        log.message.toLowerCase().includes('depressed') ||
        log.message.toLowerCase().includes('hopeless') ||
        log.message.toLowerCase().includes('anxiety') ||
        log.message.toLowerCase().includes('worry')
      ).length;

      dataPoints.recentChatActivity = recentChats.length;
      dataPoints.negativeConcerns = negativeConcerns;

      if (negativeConcerns >= 3) riskScore += 20;
      else if (negativeConcerns >= 1) riskScore += 10;
    }

    // Determine risk level
    if (riskScore >= 50) riskLevel = 'high';
    else if (riskScore >= 25) riskLevel = 'medium';
    else riskLevel = 'low';

    // Generate AI assessment using OpenAI
    let aiAssessment = '';
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiApiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: Deno.env.get('OPENAI_MODEL_DEFAULT') || 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a clinical psychologist AI assistant. Provide a brief, professional assessment of patient risk based on the data provided. Focus on key concerns and recommendations.'
              },
              {
                role: 'user',
                content: `Please assess the following patient data:
                - Risk Score: ${riskScore}
                - Risk Level: ${riskLevel}
                - Average Mood (last 7 entries): ${dataPoints.avgMood || 'N/A'}
                - Low mood episodes: ${dataPoints.lowMoodCount || 0}
                - Task completion rate: ${(dataPoints.taskCompletionRate * 100).toFixed(1) || 'N/A'}%
                - Recent negative concerns in chat: ${dataPoints.negativeConcerns || 0}
                
                Provide a concise clinical assessment and recommendations.`
              }
            ],
            max_tokens: 300,
            temperature: 0.7,
          }),
        });

        const openaiData = await response.json();
        if (openaiData.choices && openaiData.choices[0]) {
          aiAssessment = openaiData.choices[0].message.content;
        }
      } catch (error) {
        console.error('OpenAI API error:', error);
        aiAssessment = 'AI assessment unavailable due to API error.';
      }
    } else {
      aiAssessment = 'AI assessment unavailable - OpenAI API key not configured.';
    }

    // Store the risk assessment in the database
    const { data: riskAssessment, error: insertError } = await supabase
      .from('patient_risk_assessments')
      .insert({
        patient_id,
        clinician_id: user.id,
        risk_score: riskScore,
        risk_level: riskLevel,
        data_points: dataPoints,
        ai_assessment: aiAssessment,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing risk assessment:', insertError);
      return new Response(JSON.stringify({ error: 'Failed to store risk assessment' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Risk assessment completed:', riskAssessment);

    return new Response(JSON.stringify({
      success: true,
      riskAssessment,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in assess-patient-risk function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});