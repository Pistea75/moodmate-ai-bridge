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

    console.log(`Generating goal suggestions for patient: ${patientId}`);

    // Fetch patient data for goal suggestions
    const [moodData, taskData, profileData] = await Promise.all([
      // Recent mood entries
      supabase
        .from('mood_entries')
        .select('mood_score, notes, triggers, created_at')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: false })
        .limit(15),

      // Recent tasks
      supabase
        .from('tasks')
        .select('title, completed, due_date')
        .eq('patient_id', patientId)
        .order('inserted_at', { ascending: false })
        .limit(10),

      // Patient profile
      supabase
        .from('profiles')
        .select('first_name, treatment_goals, initial_assessment')
        .eq('id', patientId)
        .single()
    ]);

    if (moodData.error || taskData.error || profileData.error) {
      console.error('Error fetching patient data:', moodData.error || taskData.error || profileData.error);
      // Return fallback suggestions
      return new Response(JSON.stringify({ 
        suggestions: [
          'Track your mood daily for one week',
          'Practice deep breathing exercises twice daily',
          'Take a 10-minute walk outside each day',
          'Write down three things you\'re grateful for daily',
          'Establish a consistent bedtime routine'
        ]
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const moods = moodData.data || [];
    const tasks = taskData.data || [];
    const profile = profileData.data;

    // Analyze data for personalized suggestions
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
Patient Analysis:
- Name: ${profile?.first_name || 'Patient'}
- Recent average mood: ${avgMood ? avgMood.toFixed(1) : 'No data'}/10
- Task completion rate: ${taskCompletionRate.toFixed(1)}%
- Common triggers: ${topTriggers.join(', ') || 'None identified'}
- Treatment goals: ${profile?.treatment_goals || 'Not specified'}
- Initial assessment: ${profile?.initial_assessment || 'Not available'}
- Recent mood pattern: ${moods.slice(0, 7).map(m => m.mood_score).join(', ')}
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
            content: `You are a mental health AI assistant that generates personalized goal suggestions. Based on patient data, create 5 specific, achievable goals that:

1. Are SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
2. Address their specific triggers and patterns
3. Build on their existing strengths
4. Are appropriate for their current mood level
5. Focus on practical, actionable steps

Return ONLY a JSON array of 5 goal strings, no additional text. Each goal should be a complete sentence.

Example format: ["Practice mindfulness for 5 minutes daily", "Take a 15-minute walk 3 times this week"]`
          },
          {
            role: 'user',
            content: `Generate 5 personalized goals for this patient:\n${dataContext}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '[]';
    
    try {
      const suggestions = JSON.parse(aiResponse);
      if (Array.isArray(suggestions) && suggestions.length > 0) {
        return new Response(JSON.stringify({ suggestions }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
    }

    // Fallback suggestions if parsing fails
    const fallbackSuggestions = [
      'Track your mood daily for one week',
      'Practice deep breathing exercises twice daily',
      'Take a 10-minute walk outside each day',
      'Write down three things you\'re grateful for daily',
      'Establish a consistent bedtime routine'
    ];

    return new Response(JSON.stringify({ suggestions: fallbackSuggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-goal-suggestions function:', error);
    
    // Return fallback suggestions
    const fallbackSuggestions = [
      'Track your mood daily for one week',
      'Practice deep breathing exercises twice daily',
      'Take a 10-minute walk outside each day',
      'Write down three things you\'re grateful for daily',
      'Establish a consistent bedtime routine'
    ];

    return new Response(JSON.stringify({ suggestions: fallbackSuggestions }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});