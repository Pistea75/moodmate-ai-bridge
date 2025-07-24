
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.36.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, isClinicianView, patientId } = await req.json()
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    
    if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
      throw new Error('Missing required environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Get the current user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    let systemPrompt = `You are MoodMate, an advanced AI emotional support psychologist with expertise in evidence-based therapeutic approaches including CBT, DBT, ACT, and mindfulness-based interventions. You provide empathetic, professional psychological support with the following capabilities:

THERAPEUTIC EXPERTISE:
- Cognitive Behavioral Therapy (CBT): Help identify and challenge negative thought patterns
- Dialectical Behavior Therapy (DBT): Teach emotional regulation and distress tolerance skills
- Acceptance and Commitment Therapy (ACT): Promote psychological flexibility and value-based living
- Mindfulness-Based Interventions: Guide meditation and present-moment awareness practices
- Person-Centered Therapy: Provide unconditional positive regard and empathetic understanding

COMMUNICATION PRINCIPLES:
- Use warm, empathetic, and non-judgmental language
- Validate emotions while gently challenging distorted thinking
- Ask open-ended questions to promote self-reflection
- Provide specific, actionable coping strategies
- Always maintain hope and focus on strengths
- Adapt communication style to patient's emotional state

SAFETY PROTOCOLS:
- Monitor for signs of self-harm or suicide ideation
- Provide crisis resources when appropriate
- Encourage professional help for serious concerns
- Never diagnose or provide medical advice

RESPONSE STRUCTURE:
- Acknowledge and validate the person's feelings
- Explore thoughts and patterns gently
- Provide evidence-based coping strategies
- Offer hope and encouragement
- Suggest practical next steps when appropriate"`

    // Enhanced data fetching for clinicians
    if (isClinicianView) {
      try {
        // Fetch comprehensive patient data for clinicians
        const { data: patientLinks } = await supabase
          .from('patient_clinician_links')
          .select('patient_id')
          .eq('clinician_id', user.id)

        if (patientLinks && patientLinks.length > 0) {
          const patientIds = patientLinks.map(link => link.patient_id)
          
          // Fetch all patient data in parallel
          const [
            patientsData,
            moodData,
            aiProfilesData,
            tasksData,
            exerciseData,
            sessionsData
          ] = await Promise.all([
            // Patient profiles with emails
            supabase
              .from('profiles')
              .select('id, first_name, last_name, email, language, phone, emergency_contact_name, emergency_contact_phone, initial_assessment, treatment_goals, welcome_message, onboarding_completed, onboarding_step, status, last_active_at')
              .in('id', patientIds),
            
            // Recent mood entries (last 30 days)
            supabase
              .from('mood_entries')
              .select('patient_id, mood_score, created_at, notes, triggers')
              .in('patient_id', patientIds)
              .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
              .order('created_at', { ascending: false }),
            
            // AI personalization profiles
            supabase
              .from('ai_patient_profiles')
              .select('patient_id, preferences')
              .eq('clinician_id', user.id)
              .in('patient_id', patientIds),
            
            // Recent tasks
            supabase
              .from('tasks')
              .select('patient_id, title, description, completed, due_date, inserted_at')
              .eq('clinician_id', user.id)
              .in('patient_id', patientIds)
              .order('inserted_at', { ascending: false })
              .limit(50),
            
            // Recent exercise logs
            supabase
              .from('exercise_logs')
              .select('patient_id, exercise_text, completed, completed_at, recommended_at')
              .in('patient_id', patientIds)
              .order('recommended_at', { ascending: false })
              .limit(50),
            
            // Recent sessions
            supabase
              .from('sessions')
              .select('patient_id, scheduled_time, duration_minutes, status, notes, outcome_notes, outcome_rating, homework_assigned, next_session_focus')
              .eq('clinician_id', user.id)
              .in('patient_id', patientIds)
              .order('scheduled_time', { ascending: false })
              .limit(20)
          ])

          // Organize data by patient
          const patientDataMap = new Map()
          
          // Initialize with patient profiles
          patientsData.data?.forEach(patient => {
            patientDataMap.set(patient.id, {
              profile: patient,
              moodEntries: [],
              aiPersonalization: null,
              tasks: [],
              exercises: [],
              sessions: []
            })
          })

          // Add mood data
          moodData.data?.forEach(mood => {
            const patientData = patientDataMap.get(mood.patient_id)
            if (patientData) {
              patientData.moodEntries.push(mood)
            }
          })

          // Add AI personalization
          aiProfilesData.data?.forEach(profile => {
            const patientData = patientDataMap.get(profile.patient_id)
            if (patientData) {
              patientData.aiPersonalization = profile.preferences
            }
          })

          // Add tasks
          tasksData.data?.forEach(task => {
            const patientData = patientDataMap.get(task.patient_id)
            if (patientData) {
              patientData.tasks.push(task)
            }
          })

          // Add exercises
          exerciseData.data?.forEach(exercise => {
            const patientData = patientDataMap.get(exercise.patient_id)
            if (patientData) {
              patientData.exercises.push(exercise)
            }
          })

          // Add sessions
          sessionsData.data?.forEach(session => {
            const patientData = patientDataMap.get(session.patient_id)
            if (patientData) {
              patientData.sessions.push(session)
            }
          })

          // Create comprehensive context for AI
          const patientsContext = Array.from(patientDataMap.values()).map(data => {
            const profile = data.profile
            const recentMoods = data.moodEntries.slice(0, 10)
            const avgMood = recentMoods.length > 0 
              ? recentMoods.reduce((sum, entry) => sum + entry.mood_score, 0) / recentMoods.length 
              : null

            return {
              name: `${profile.first_name} ${profile.last_name}`,
              email: profile.email,
              id: profile.id,
              contactInfo: {
                phone: profile.phone,
                emergencyContact: profile.emergency_contact_name,
                emergencyPhone: profile.emergency_contact_phone
              },
              onboardingStatus: {
                completed: profile.onboarding_completed,
                step: profile.onboarding_step,
                initialAssessment: profile.initial_assessment,
                treatmentGoals: profile.treatment_goals,
                welcomeMessage: profile.welcome_message
              },
              status: {
                current: profile.status,
                lastActive: profile.last_active_at
              },
              moodData: {
                recent: recentMoods.map(m => ({
                  score: m.mood_score,
                  date: m.created_at,
                  notes: m.notes,
                  triggers: m.triggers
                })),
                average: avgMood ? Math.round(avgMood * 10) / 10 : null,
                trendAnalysis: recentMoods.length >= 3 ? 
                  (recentMoods[0].mood_score > recentMoods[2].mood_score ? 'improving' : 
                   recentMoods[0].mood_score < recentMoods[2].mood_score ? 'declining' : 'stable') : null
              },
              aiPersonalization: data.aiPersonalization,
              tasks: data.tasks.map(t => ({
                title: t.title,
                description: t.description,
                completed: t.completed,
                dueDate: t.due_date,
                assigned: t.inserted_at
              })),
              exercises: data.exercises.map(e => ({
                text: e.exercise_text,
                completed: e.completed,
                completedAt: e.completed_at,
                recommendedAt: e.recommended_at
              })),
              sessions: data.sessions.map(s => ({
                scheduledTime: s.scheduled_time,
                duration: s.duration_minutes,
                status: s.status,
                notes: s.notes,
                outcomeNotes: s.outcome_notes,
                outcomeRating: s.outcome_rating,
                homework: s.homework_assigned,
                nextFocus: s.next_session_focus
              }))
            }
          })

          systemPrompt = `You are an AI assistant helping a mental health clinician. You have access to comprehensive data about their patients and should use this information to provide informed, professional assistance.

PATIENT DATA AVAILABLE:
${JSON.stringify(patientsContext, null, 2)}

Guidelines:
- You can discuss any patient by name or email when the clinician asks
- Provide insights based on mood trends, task completion, and session notes
- Suggest treatment approaches based on CBT principles and patient history
- Respect patient confidentiality - only discuss patients with their assigned clinician
- Use the AI personalization settings to understand how to best interact with each patient
- Reference specific data points when making recommendations
- Help with treatment planning, progress monitoring, and identifying concerning patterns

You are speaking with a clinician who has professional access to this patient information. Be thorough and specific in your responses while maintaining professional standards.`
        }
      } catch (error) {
        console.error('Error fetching patient data:', error)
        // Fallback to basic clinician prompt if data fetching fails
        systemPrompt = "You are an AI assistant helping a mental health clinician. Provide professional, evidence-based guidance for patient care and treatment planning."
      }
    }

    // Get AI personalization if available for patient view
    if (!isClinicianView && patientId) {
      try {
        const { data: aiProfile } = await supabase
          .from('ai_patient_profiles')
          .select('preferences')
          .eq('patient_id', patientId)
          .single()

        if (aiProfile?.preferences) {
          const prefs = aiProfile.preferences as any
          if (prefs.communicationStyle || prefs.therapeuticApproach || prefs.specificInstructions) {
            systemPrompt += `\n\nPersonalized for this patient:
- Communication style: ${prefs.communicationStyle || 'Standard supportive approach'}
- Therapeutic approach: ${prefs.therapeuticApproach || 'General CBT techniques'}
- Specific instructions: ${prefs.specificInstructions || 'None'}`
          }
        }
      } catch (error) {
        console.error('Error fetching AI personalization:', error)
      }
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    // Store the conversation in chat logs
    if (!isClinicianView) {
      await supabase.from('ai_chat_logs').insert([
        { patient_id: user.id, role: 'user', message },
        { patient_id: user.id, role: 'assistant', message: aiMessage }
      ])
    }

    return new Response(JSON.stringify({ message: aiMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Error in chat-ai function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
