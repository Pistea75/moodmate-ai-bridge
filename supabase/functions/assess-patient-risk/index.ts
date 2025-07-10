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
    const { patientId, clinicianId } = await req.json();
    
    if (!patientId) {
      throw new Error('Patient ID is required');
    }

    console.log(`Assessing risk for patient: ${patientId}`);

    // Fetch comprehensive patient data
    const [moodData, sessionsData, tasksData, profileData] = await Promise.all([
      // Mood entries from last 30 days
      supabase
        .from('mood_entries')
        .select('mood_score, notes, triggers, created_at')
        .eq('patient_id', patientId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false }),

      // Recent sessions
      supabase
        .from('sessions')
        .select('scheduled_time, status, notes, duration_minutes')
        .eq('patient_id', patientId)
        .gte('scheduled_time', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
        .order('scheduled_time', { ascending: false }),

      // Task completion rate
      supabase
        .from('tasks')
        .select('completed, due_date, created_at, title')
        .eq('patient_id', patientId)
        .gte('inserted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Patient profile
      supabase
        .from('profiles')
        .select('first_name, last_name, created_at')
        .eq('id', patientId)
        .single()
    ]);

    if (moodData.error) throw moodData.error;
    if (sessionsData.error) throw sessionsData.error;
    if (tasksData.error) throw tasksData.error;
    if (profileData.error) throw profileData.error;

    // Prepare data summary for AI analysis
    const moodEntries = moodData.data || [];
    const sessions = sessionsData.data || [];
    const tasks = tasksData.data || [];
    const profile = profileData.data;

    const avgMoodScore = moodEntries.length > 0 
      ? moodEntries.reduce((sum, entry) => sum + entry.mood_score, 0) / moodEntries.length 
      : null;

    const recentMoodTrend = moodEntries.slice(0, 7); // Last 7 entries
    const completedTasks = tasks.filter(task => task.completed);
    const taskCompletionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : null;
    const missedSessions = sessions.filter(session => session.status === 'cancelled' || session.status === 'no_show');

    // Common triggers analysis
    const allTriggers = moodEntries.flatMap(entry => entry.triggers || []);
    const triggerCounts = allTriggers.reduce((acc, trigger) => {
      acc[trigger] = (acc[trigger] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dataContext = `
Patient Risk Assessment Data for ${profile.first_name} ${profile.last_name}:

MOOD DATA (Last 30 days):
- Total mood entries: ${moodEntries.length}
- Average mood score: ${avgMoodScore ? avgMoodScore.toFixed(1) : 'No data'}/10
- Recent mood trend (last 7 entries): ${recentMoodTrend.map(m => m.mood_score).join(', ')}
- Most common triggers: ${Object.entries(triggerCounts).sort(([,a], [,b]) => b - a).slice(0, 5).map(([trigger, count]) => `${trigger} (${count}x)`).join(', ')}

SESSION DATA (Last 60 days):
- Total sessions scheduled: ${sessions.length}
- Missed/cancelled sessions: ${missedSessions.length}
- Session attendance rate: ${sessions.length > 0 ? ((sessions.length - missedSessions.length) / sessions.length * 100).toFixed(1) : 'No data'}%

TASK COMPLETION (Last 30 days):
- Total tasks assigned: ${tasks.length}
- Tasks completed: ${completedTasks.length}
- Completion rate: ${taskCompletionRate !== null ? taskCompletionRate.toFixed(1) : 'No data'}%

RECENT CONCERNING NOTES:
${moodEntries.filter(entry => entry.mood_score <= 3 && entry.notes).slice(0, 3).map(entry => `- Score ${entry.mood_score}: ${entry.notes}`).join('\n')}
    `.trim();

    // Call OpenAI for risk assessment
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: `You are a clinical risk assessment AI assistant helping clinicians evaluate patient risk levels. 
            
            Analyze the provided patient data and provide:
            1. Overall risk level: LOW, MODERATE, HIGH, or CRITICAL
            2. Key risk factors identified
            3. Specific recommendations for the clinician
            4. Suggested intervention timeline
            
            Base your assessment on:
            - Mood patterns and trends
            - Session attendance
            - Task completion rates
            - Specific concerning notes or triggers
            
            Be clinical but not alarmist. Focus on actionable insights.`
          },
          {
            role: 'user',
            content: dataContext
          }
        ],
        temperature: 0.3,
        max_tokens: 800
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const aiResult = await response.json();
    const riskAssessment = aiResult.choices[0].message.content;

    // Extract risk level from the response
    const riskMatch = riskAssessment.match(/risk level:\s*(LOW|MODERATE|HIGH|CRITICAL)/i);
    const riskLevel = riskMatch ? riskMatch[1].toUpperCase() : 'MODERATE';

    // Calculate risk score (0-100)
    let riskScore = 50; // Default moderate risk
    
    if (avgMoodScore !== null) {
      if (avgMoodScore <= 3) riskScore += 30;
      else if (avgMoodScore <= 5) riskScore += 15;
      else if (avgMoodScore >= 8) riskScore -= 10;
    }

    if (taskCompletionRate !== null) {
      if (taskCompletionRate < 30) riskScore += 20;
      else if (taskCompletionRate < 60) riskScore += 10;
      else if (taskCompletionRate > 80) riskScore -= 5;
    }

    const attendanceRate = sessions.length > 0 ? ((sessions.length - missedSessions.length) / sessions.length) * 100 : 100;
    if (attendanceRate < 50) riskScore += 25;
    else if (attendanceRate < 70) riskScore += 10;

    // Recent concerning notes
    const recentLowMoods = moodEntries.filter(entry => entry.mood_score <= 3).length;
    if (recentLowMoods >= 5) riskScore += 20;
    else if (recentLowMoods >= 3) riskScore += 10;

    riskScore = Math.min(100, Math.max(0, riskScore));

    // Save assessment to database
    const assessmentData = {
      patient_id: patientId,
      clinician_id: clinicianId,
      risk_level: riskLevel,
      risk_score: riskScore,
      ai_assessment: riskAssessment,
      data_points: {
        avg_mood_score: avgMoodScore,
        task_completion_rate: taskCompletionRate,
        session_attendance_rate: attendanceRate,
        recent_mood_entries: moodEntries.length,
        missed_sessions: missedSessions.length
      },
      assessed_at: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({
        success: true,
        assessment: assessmentData,
        summary: {
          riskLevel,
          riskScore,
          keyFactors: {
            avgMoodScore,
            taskCompletionRate,
            attendanceRate,
            recentEntries: moodEntries.length
          }
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error: any) {
    console.error('Error in assess-patient-risk function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});