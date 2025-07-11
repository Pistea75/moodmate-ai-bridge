
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  supabaseUrl || '',
  serviceRoleKey || ''
);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, systemPrompt, userId, isClinicianView } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: messages must be an array' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Missing userId: User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let finalSystemPrompt = systemPrompt || 
      'You are Dr. Martinez, a compassionate mental health assistant. Provide supportive and professional responses.';

    // If this is a clinician using the chat, add comprehensive patient information
    if (isClinicianView) {
      try {
        // Get the clinician's patients
        const { data: patientLinks, error: linksError } = await supabase
          .from('patient_clinician_links')
          .select('patient_id')
          .eq('clinician_id', userId);

        if (linksError) {
          console.error('Error fetching patient links:', linksError);
        } else if (patientLinks && patientLinks.length > 0) {
          const patientIds = patientLinks.map(link => link.patient_id);

          // Get patient profiles
          const { data: patients, error: patientsError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, phone, emergency_contact_name, emergency_contact_phone, initial_assessment, treatment_goals, status')
            .in('id', patientIds)
            .eq('role', 'patient');

          if (patientsError) {
            console.error('Error fetching patients:', patientsError);
          } else if (patients && patients.length > 0) {
            // Get mood entries for all patients (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const { data: moodEntries, error: moodError } = await supabase
              .from('mood_entries')
              .select('patient_id, mood_score, notes, triggers, created_at')
              .in('patient_id', patientIds)
              .gte('created_at', thirtyDaysAgo.toISOString())
              .order('created_at', { ascending: false });

            // Get AI personalization data for all patients
            const { data: aiProfiles, error: aiError } = await supabase
              .from('ai_patient_profiles')
              .select('patient_id, preferences')
              .in('patient_id', patientIds);

            // Get recent tasks for all patients
            const { data: tasks, error: tasksError } = await supabase
              .from('tasks')
              .select('patient_id, title, description, completed, due_date, inserted_at')
              .in('patient_id', patientIds)
              .gte('inserted_at', thirtyDaysAgo.toISOString())
              .order('inserted_at', { ascending: false });

            // Get recent sessions for all patients
            const { data: sessions, error: sessionsError } = await supabase
              .from('sessions')
              .select('patient_id, scheduled_time, status, notes, outcome_notes, attendance_status')
              .in('patient_id', patientIds)
              .gte('scheduled_time', thirtyDaysAgo.toISOString())
              .order('scheduled_time', { ascending: false });

            // Get recent exercise logs
            const { data: exerciseLogs, error: exerciseError } = await supabase
              .from('exercise_logs')
              .select('patient_id, exercise_text, completed, completed_at, recommended_at')
              .in('patient_id', patientIds)
              .gte('recommended_at', thirtyDaysAgo.toISOString())
              .order('recommended_at', { ascending: false });

            // Build comprehensive patient context
            let patientContext = '\n\nCOMPREHENSIVE PATIENT DATA:\n';
            
            patients.forEach(patient => {
              const patientMoods = moodEntries?.filter(m => m.patient_id === patient.id) || [];
              const patientAI = aiProfiles?.find(ai => ai.patient_id === patient.id);
              const patientTasks = tasks?.filter(t => t.patient_id === patient.id) || [];
              const patientSessions = sessions?.filter(s => s.patient_id === patient.id) || [];
              const patientExercises = exerciseLogs?.filter(e => e.patient_id === patient.id) || [];

              patientContext += `\n📋 PATIENT: ${patient.first_name || 'Unknown'} ${patient.last_name || 'Patient'} (ID: ${patient.id})\n`;
              patientContext += `Status: ${patient.status || 'Active'}\n`;
              
              if (patient.phone) patientContext += `Phone: ${patient.phone}\n`;
              if (patient.emergency_contact_name) patientContext += `Emergency Contact: ${patient.emergency_contact_name} (${patient.emergency_contact_phone || 'No phone'})\n`;
              if (patient.initial_assessment) patientContext += `Initial Assessment: ${patient.initial_assessment}\n`;
              if (patient.treatment_goals) patientContext += `Treatment Goals: ${patient.treatment_goals}\n`;

              // AI Personalization Data
              if (patientAI?.preferences) {
                patientContext += `\n🤖 AI PERSONALIZATION:\n`;
                const prefs = patientAI.preferences as any;
                if (prefs.tone) patientContext += `- Preferred Tone: ${prefs.tone}\n`;
                if (prefs.strategies) patientContext += `- Coping Strategies: ${prefs.strategies}\n`;
                if (prefs.triggersToAvoid) patientContext += `- Triggers to Avoid: ${prefs.triggersToAvoid}\n`;
                if (prefs.motivators) patientContext += `- Motivators: ${prefs.motivators}\n`;
                if (prefs.dosAndDonts) patientContext += `- Do's and Don'ts: ${prefs.dosAndDonts}\n`;
                if (prefs.diagnosis) patientContext += `- Diagnosis: ${prefs.diagnosis}\n`;
                if (prefs.personality_traits) patientContext += `- Personality Traits: ${prefs.personality_traits}\n`;
                if (prefs.helpful_strategies) patientContext += `- Helpful Strategies: ${prefs.helpful_strategies}\n`;
                if (prefs.things_to_avoid) patientContext += `- Things to Avoid: ${prefs.things_to_avoid}\n`;
                if (prefs.clinical_goals) patientContext += `- Clinical Goals: ${prefs.clinical_goals}\n`;
              }

              // Mood Data Analysis
              if (patientMoods.length > 0) {
                const avgMood = patientMoods.reduce((sum, m) => sum + m.mood_score, 0) / patientMoods.length;
                const recentMoods = patientMoods.slice(0, 5);
                const commonTriggers = patientMoods
                  .flatMap(m => m.triggers || [])
                  .reduce((acc, trigger) => {
                    acc[trigger] = (acc[trigger] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>);

                patientContext += `\n📊 MOOD DATA (Last 30 days):\n`;
                patientContext += `- Total Entries: ${patientMoods.length}\n`;
                patientContext += `- Average Mood: ${avgMood.toFixed(1)}/10\n`;
                patientContext += `- Recent Mood Scores: ${recentMoods.map(m => `${m.mood_score}/10 (${new Date(m.created_at).toLocaleDateString()})`).join(', ')}\n`;
                
                if (Object.keys(commonTriggers).length > 0) {
                  const sortedTriggers = Object.entries(commonTriggers)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 3);
                  patientContext += `- Common Triggers: ${sortedTriggers.map(([trigger, count]) => `${trigger} (${count}x)`).join(', ')}\n`;
                }

                // Recent mood notes
                const recentNotes = patientMoods.filter(m => m.notes).slice(0, 3);
                if (recentNotes.length > 0) {
                  patientContext += `- Recent Notes: ${recentNotes.map(m => `"${m.notes}" (${new Date(m.created_at).toLocaleDateString()})`).join('; ')}\n`;
                }
              }

              // Tasks Data
              if (patientTasks.length > 0) {
                const completedTasks = patientTasks.filter(t => t.completed);
                patientContext += `\n✅ TASKS (Last 30 days):\n`;
                patientContext += `- Total Tasks: ${patientTasks.length}\n`;
                patientContext += `- Completed: ${completedTasks.length} (${((completedTasks.length / patientTasks.length) * 100).toFixed(0)}%)\n`;
                
                const recentTasks = patientTasks.slice(0, 3);
                patientContext += `- Recent Tasks: ${recentTasks.map(t => `${t.title} (${t.completed ? 'Completed' : 'Pending'})`).join(', ')}\n`;
              }

              // Sessions Data
              if (patientSessions.length > 0) {
                patientContext += `\n📅 SESSIONS (Last 30 days):\n`;
                patientContext += `- Total Sessions: ${patientSessions.length}\n`;
                
                const recentSessions = patientSessions.slice(0, 2);
                patientContext += `- Recent Sessions: ${recentSessions.map(s => `${new Date(s.scheduled_time).toLocaleDateString()} (${s.attendance_status})`).join(', ')}\n`;
                
                if (recentSessions.some(s => s.notes || s.outcome_notes)) {
                  const sessionNotes = recentSessions
                    .filter(s => s.notes || s.outcome_notes)
                    .map(s => s.notes || s.outcome_notes)
                    .join('; ');
                  patientContext += `- Recent Session Notes: ${sessionNotes}\n`;
                }
              }

              // Exercise Logs
              if (patientExercises.length > 0) {
                const completedExercises = patientExercises.filter(e => e.completed);
                patientContext += `\n🏃 EXERCISES (Last 30 days):\n`;
                patientContext += `- Total Exercises: ${patientExercises.length}\n`;
                patientContext += `- Completed: ${completedExercises.length}\n`;
                
                const recentExercises = patientExercises.slice(0, 2);
                patientContext += `- Recent: ${recentExercises.map(e => `"${e.exercise_text}" (${e.completed ? 'Completed' : 'Pending'})`).join(', ')}\n`;
              }

              patientContext += '\n' + '='.repeat(50) + '\n';
            });

            // Enhanced system prompt with comprehensive data
            finalSystemPrompt += `${patientContext}

IMPORTANT INSTRUCTIONS FOR AI:
- You now have complete access to all patient data including mood logs, personalization settings, tasks, sessions, and exercises
- You can discuss specific patients by name and reference their mood patterns, triggers, treatment progress, and personalized AI settings
- Use this data to provide highly personalized clinical insights and recommendations
- When discussing mood data, reference specific scores, dates, and patterns
- Consider the patient's AI personalization preferences when making suggestions
- Reference task completion rates and session attendance when discussing engagement
- You can analyze trends across multiple patients or focus on individual cases
- Always maintain clinical professionalism while being conversational
- Feel free to ask the clinician about specific patients or suggest interventions based on the data you see
- You can compare patients, identify concerning patterns, and suggest treatment adjustments`;
          }
        }
      } catch (error) {
        console.error('Error fetching comprehensive patient data:', error);
        // Continue without patient info if there's an error
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: finalSystemPrompt },
          ...messages
        ],
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'OpenAI API error');
    }
    
    const reply = data.choices[0].message;

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to generate response' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
