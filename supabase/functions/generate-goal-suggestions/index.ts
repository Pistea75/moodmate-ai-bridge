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

    // Fetch patient data for goal suggestions
    const [
      moodData,
      taskData,
      profileData,
      sessionData
    ] = await Promise.all([
      // Recent mood entries (last 30 days)
      supabase
        .from('mood_entries')
        .select('mood_score, triggers, created_at')
        .eq('patient_id', patientId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false }),
      
      // Recent tasks to understand completion patterns
      supabase
        .from('tasks')
        .select('title, completed, due_date')
        .eq('patient_id', patientId)
        .order('inserted_at', { ascending: false })
        .limit(20),
      
      // Patient profile for context
      supabase
        .from('profiles')
        .select('first_name, treatment_goals, initial_assessment')
        .eq('id', patientId)
        .single(),
      
      // Recent sessions for additional context
      supabase
        .from('sessions')
        .select('outcome_notes, homework_assigned')
        .eq('patient_id', patientId)
        .order('scheduled_time', { ascending: false })
        .limit(3)
    ]);

    // Analyze patterns
    const moodEntries = moodData.data || [];
    const tasks = taskData.data || [];
    const profile = profileData.data;
    const sessions = sessionData.data || [];

    const avgMood = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length 
      : 5;

    const taskCompletionRate = tasks.length > 0 
      ? (tasks.filter(t => t.completed).length / tasks.length) * 100
      : 0;

    const commonTriggers = moodEntries
      .flatMap(entry => entry.triggers || [])
      .reduce((acc, trigger) => {
        acc[trigger] = (acc[trigger] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const context = {
      avgMood: avgMood.toFixed(1),
      moodTrend: moodEntries.length >= 3 
        ? (moodEntries[0].mood_score > moodEntries[2].mood_score ? 'improving' : 
           moodEntries[0].mood_score < moodEntries[2].mood_score ? 'declining' : 'stable')
        : 'stable',
      taskCompletionRate: Math.round(taskCompletionRate),
      commonTriggers: Object.keys(commonTriggers).slice(0, 3),
      treatmentGoals: profile?.treatment_goals,
      recentHomework: sessions.map(s => s.homework_assigned).filter(Boolean),
      hasLowMoodDays: moodEntries.some(entry => entry.mood_score <= 3),
      hasHighMoodDays: moodEntries.some(entry => entry.mood_score >= 8)
    };

    const prompt = `Based on this patient's mental health data, suggest 5 personalized, achievable goals. Each goal should be:
- Specific and measurable
- Achievable within 1-4 weeks  
- Tailored to their patterns and needs
- Focused on mental health improvement
- Action-oriented

Patient Analysis:
- Average mood: ${context.avgMood}/10 (trend: ${context.moodTrend})
- Task completion rate: ${context.taskCompletionRate}%
- Common mood triggers: ${context.commonTriggers.join(', ') || 'None identified'}
- Treatment goals: ${context.treatmentGoals || 'Not specified'}
- Has low mood days: ${context.hasLowMoodDays}
- Has high mood days: ${context.hasHighMoodDays}

Return exactly 5 goal suggestions as a JSON array of strings. Each string should be a complete, actionable goal statement.

Example format: ["Complete 3 mindfulness exercises per week", "Maintain mood score above 6 for 5 consecutive days"]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a mental health assistant specializing in goal setting. Return only valid JSON arrays of goal strings, no additional text.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let suggestions;
    
    try {
      const content = data.choices[0]?.message?.content;
      suggestions = JSON.parse(content);
      
      // Validate it's an array of strings
      if (!Array.isArray(suggestions) || !suggestions.every(s => typeof s === 'string')) {
        throw new Error('Invalid format');
      }
    } catch (parseError) {
      // Fallback suggestions if AI response can't be parsed
      suggestions = [
        'Track your mood daily for one week',
        'Complete 2 relaxation exercises per week',
        'Practice positive self-talk when feeling stressed',
        'Establish a consistent bedtime routine',
        'Connect with a friend or family member weekly'
      ];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-goal-suggestions function:', error);
    
    // Return fallback suggestions
    const fallbackSuggestions = [
      'Track your mood daily for one week',
      'Practice deep breathing for 5 minutes daily',
      'Complete at least 3 assigned tasks this week',
      'Take a 10-minute walk when feeling stressed',
      'Write down one positive thing each day'
    ];
    
    return new Response(
      JSON.stringify({ 
        suggestions: fallbackSuggestions,
        error: error.message 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});