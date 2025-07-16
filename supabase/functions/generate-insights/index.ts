import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientId } = await req.json();

    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    console.log(`Generating insights for patient: ${patientId}`);

    // Fetch patient data for insights
    const [moodData, taskData, profileData] = await Promise.all([
      // Recent mood entries
      supabase
        .from('mood_entries')
        .select('mood_score, notes, triggers, created_at')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(10),

      // Recent tasks
      supabase
        .from('tasks')
        .select('title, completed, due_date, inserted_at')
        .eq('patient_id', patientId)
        .order('inserted_at', { ascending: false })
        .limit(10),

      // Patient profile
      supabase
        .from('profiles')
        .select('first_name, treatment_goals')
        .eq('id', patientId)
        .single()
    ]);

    if (moodData.error || taskData.error || profileData.error) {
      console.error('Error fetching patient data:', moodData.error || taskData.error || profileData.error);
      throw new Error('Failed to fetch patient data');
    }

    const moods = moodData.data || [];
    const tasks = taskData.data || [];
    const profile = profileData.data;

    // Calculate insights
    const avgMood = moods.length > 0 ? moods.reduce((sum, m) => sum + m.mood_score, 0) / moods.length : null;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskCompletionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Common triggers
    const allTriggers = moods.flatMap(m => m.triggers || []);
    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topTriggers = Object.entries(triggerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([trigger]) => trigger);

    const dataContext = `
Patient Data Summary:
- Recent average mood: ${avgMood ? avgMood.toFixed(1) : 'No data'}/10
- Task completion rate: ${taskCompletionRate.toFixed(1)}%
- Common triggers: ${topTriggers.join(', ') || 'None identified'}
- Treatment goals: ${profile?.treatment_goals || 'Not specified'}
- Recent mood trend: ${moods.slice(0, 5).map(m => m.mood_score).join(', ')}
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
          {
            role: 'system',
            content: `You are a supportive mental health AI assistant. Based on the patient data provided, generate a personalized, encouraging insight that:

1. Acknowledges their progress and efforts
2. Provides gentle guidance or encouragement
3. Suggests practical coping strategies
4. Remains positive and supportive
5. Keeps the message concise (2-3 sentences)

Focus on strengths, progress, and forward-looking suggestions. Avoid clinical diagnoses or medical advice.`
          },
          {
            role: 'user',
            content: `Generate a personalized insight for ${profile?.first_name || 'this patient'} based on their data:\n${dataContext}`
          }
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
    const insight = data.choices[0]?.message?.content || 'Keep focusing on your mental health journey. You\'re doing great!';

    return new Response(JSON.stringify({ insight }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-insights function:', error);
    return new Response(
      JSON.stringify({ 
        insight: 'Remember to take things one day at a time. Your mental health journey is important, and every small step counts!'
      }),
      {
        status: 200, // Return 200 with fallback message
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});