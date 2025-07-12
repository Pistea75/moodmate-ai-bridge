import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the current user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    // Fetch comprehensive patient data
    const [
      moodData,
      taskData,
      exerciseData,
      profileData
    ] = await Promise.all([
      // Recent mood entries (last 14 days)
      supabase
        .from('mood_entries')
        .select('mood_score, created_at, notes, triggers')
        .eq('patient_id', patientId)
        .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false }),
      
      // Recent tasks
      supabase
        .from('tasks')
        .select('title, completed, due_date, inserted_at')
        .eq('patient_id', patientId)
        .order('inserted_at', { ascending: false })
        .limit(10),
      
      // Recent exercise logs
      supabase
        .from('exercise_logs')
        .select('exercise_text, completed, completed_at')
        .eq('patient_id', patientId)
        .order('recommended_at', { ascending: false })
        .limit(5),
      
      // Patient profile
      supabase
        .from('profiles')
        .select('first_name, treatment_goals, initial_assessment')
        .eq('id', patientId)
        .single()
    ]);

    // Prepare context for AI
    const context = {
      mood: {
        entries: moodData.data?.map(m => ({
          score: m.mood_score,
          date: m.created_at,
          notes: m.notes,
          triggers: m.triggers
        })) || [],
        average: moodData.data?.length > 0 
          ? moodData.data.reduce((sum, entry) => sum + entry.mood_score, 0) / moodData.data.length 
          : null
      },
      tasks: {
        total: taskData.data?.length || 0,
        completed: taskData.data?.filter(t => t.completed).length || 0,
        recent: taskData.data?.slice(0, 5).map(t => ({
          title: t.title,
          completed: t.completed,
          dueDate: t.due_date
        })) || []
      },
      exercises: {
        total: exerciseData.data?.length || 0,
        completed: exerciseData.data?.filter(e => e.completed).length || 0,
        recent: exerciseData.data?.map(e => ({
          text: e.exercise_text,
          completed: e.completed
        })) || []
      },
      profile: {
        name: profileData.data?.first_name || 'there',
        goals: profileData.data?.treatment_goals,
        assessment: profileData.data?.initial_assessment
      }
    };

    const prompt = `You are a supportive mental health AI assistant. Based on the following patient data, provide a personalized, encouraging insight that:

1. Acknowledges their recent progress or challenges
2. Offers specific, actionable encouragement
3. Highlights positive patterns or suggests gentle improvements
4. Keeps a warm, supportive tone
5. Is concise (2-3 sentences max)

Patient Data:
- Name: ${context.profile.name}
- Recent mood average: ${context.mood.average ? context.mood.average.toFixed(1) : 'No recent data'}
- Mood entries (last 14 days): ${context.mood.entries.length}
- Tasks completed: ${context.tasks.completed}/${context.tasks.total}
- Treatment goals: ${context.profile.goals || 'Not specified'}

Recent mood data: ${JSON.stringify(context.mood.entries.slice(0, 7))}
Recent tasks: ${JSON.stringify(context.tasks.recent)}

Generate a personalized insight that feels genuine and supportive:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a compassionate mental health assistant specializing in CBT techniques. Provide personalized, actionable insights based on patient data.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const insight = data.choices[0]?.message?.content || 'You\'re doing great by taking care of your mental health. Keep up the good work!';

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(
      JSON.stringify({ 
        insight: "I'm here to support you on your mental health journey. Feel free to chat with me anytime!",
        error: error.message 
      }),
      { 
        status: 200, // Return 200 with fallback message instead of error
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});