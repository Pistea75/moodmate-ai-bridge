import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { auth: { persistSession: false } }
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Get user from auth header
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Invalid authorization')
    }

    const { userId, analysisType } = await req.json()

    // Validate input
    if (!userId || !analysisType) {
      throw new Error('Missing required parameters: userId, analysisType')
    }

    // Ensure user can only analyze their own data or their patients' data
    if (userId !== user.id) {
      // Check if user is a clinician analyzing a patient
      const { data: link } = await supabaseClient
        .from('patient_clinician_links')
        .select('*')
        .eq('patient_id', userId)
        .eq('clinician_id', user.id)
        .single()

      if (!link) {
        throw new Error('Unauthorized to analyze this user\'s data')
      }
    }

    let analysisData = {}
    let confidenceScore = 0

    switch (analysisType) {
      case 'mood_timing':
        analysisData = await analyzeMoodTiming(supabaseClient, userId)
        confidenceScore = 0.8
        break
      
      case 'task_completion':
        analysisData = await analyzeTaskCompletion(supabaseClient, userId)
        confidenceScore = 0.75
        break
      
      case 'engagement':
        analysisData = await analyzeEngagement(supabaseClient, userId)
        confidenceScore = 0.7
        break
      
      case 'response_effectiveness':
        analysisData = await analyzeResponseEffectiveness(supabaseClient, userId)
        confidenceScore = 0.85
        break
      
      default:
        throw new Error('Invalid analysis type')
    }

    // Store analysis results
    const { error: insertError } = await supabaseClient
      .from('brodi_pattern_analysis')
      .upsert({
        user_id: userId,
        pattern_type: analysisType,
        analysis_data: analysisData,
        confidence_score: confidenceScore,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: 'user_id,pattern_type'
      })

    if (insertError) {
      throw insertError
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisData,
        confidence: confidenceScore
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in brodi-ai-analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

async function analyzeMoodTiming(supabaseClient: any, userId: string) {
  // Analyze when user typically logs moods
  const { data: moodEntries } = await supabaseClient
    .from('mood_entries')
    .select('created_at, mood_score')
    .eq('patient_id', userId)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order('created_at', { ascending: false })

  if (!moodEntries || moodEntries.length === 0) {
    return { message: 'No mood data available for analysis' }
  }

  // Analyze patterns
  const hourCounts: Record<number, number> = {}
  const dayOfWeekCounts: Record<number, number> = {}
  let totalScore = 0

  moodEntries.forEach(entry => {
    const date = new Date(entry.created_at)
    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1
    totalScore += entry.mood_score
  })

  const bestHour = Object.entries(hourCounts).reduce((a, b) => 
    hourCounts[parseInt(a[0])] > hourCounts[parseInt(b[0])] ? a : b
  )[0]

  const bestDay = Object.entries(dayOfWeekCounts).reduce((a, b) => 
    dayOfWeekCounts[parseInt(a[0])] > dayOfWeekCounts[parseInt(b[0])] ? a : b
  )[0]

  const averageMood = totalScore / moodEntries.length

  return {
    optimalHour: parseInt(bestHour),
    optimalDayOfWeek: parseInt(bestDay),
    averageMood: Math.round(averageMood * 10) / 10,
    entryFrequency: moodEntries.length,
    recommendations: {
      bestTimeToNudge: `${bestHour}:00`,
      nudgeMessage: averageMood < 5 
        ? "I noticed this is usually when you check in. How can I support you today?"
        : "This seems like a good time for your mood check-in! How are you feeling?"
    }
  }
}

async function analyzeTaskCompletion(supabaseClient: any, userId: string) {
  const { data: tasks } = await supabaseClient
    .from('tasks')
    .select('*')
    .eq('patient_id', userId)
    .gte('inserted_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  if (!tasks || tasks.length === 0) {
    return { message: 'No task data available for analysis' }
  }

  const completed = tasks.filter(t => t.completed).length
  const total = tasks.length
  const completionRate = (completed / total) * 100

  return {
    completionRate: Math.round(completionRate),
    totalTasks: total,
    completedTasks: completed,
    recommendations: {
      encouragementLevel: completionRate > 70 ? 'high' : completionRate > 40 ? 'medium' : 'supportive',
      suggestedNudge: completionRate > 70 
        ? "You're doing amazing with your tasks! Keep up the great work! 🎉"
        : "Every small step counts. Which task feels most manageable today?"
    }
  }
}

async function analyzeEngagement(supabaseClient: any, userId: string) {
  const { data: interactions } = await supabaseClient
    .from('brodi_interactions')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())

  if (!interactions || interactions.length === 0) {
    return { message: 'No interaction data available for analysis' }
  }

  const engaged = interactions.filter(i => i.user_response === 'engaged' || i.user_response === 'completed_action').length
  const total = interactions.length
  const engagementRate = (engaged / total) * 100

  return {
    engagementRate: Math.round(engagementRate),
    totalInteractions: total,
    engagedInteractions: engaged,
    preferredInteractionTypes: interactions
      .filter(i => i.user_response === 'engaged' || i.user_response === 'completed_action')
      .map(i => i.interaction_type)
  }
}

async function analyzeResponseEffectiveness(supabaseClient: any, userId: string) {
  const { data: interactions } = await supabaseClient
    .from('brodi_interactions')
    .select('*')
    .eq('user_id', userId)
    .not('effectiveness_score', 'is', null)
    .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  if (!interactions || interactions.length === 0) {
    return { message: 'No effectiveness data available for analysis' }
  }

  const avgEffectiveness = interactions.reduce((sum, i) => sum + (i.effectiveness_score || 0), 0) / interactions.length
  
  const typeEffectiveness: Record<string, number[]> = {}
  interactions.forEach(i => {
    if (!typeEffectiveness[i.interaction_type]) {
      typeEffectiveness[i.interaction_type] = []
    }
    typeEffectiveness[i.interaction_type].push(i.effectiveness_score || 0)
  })

  const bestType = Object.entries(typeEffectiveness).reduce((best, [type, scores]) => {
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length
    return avg > best.score ? { type, score: avg } : best
  }, { type: '', score: 0 })

  return {
    overallEffectiveness: Math.round(avgEffectiveness * 10) / 10,
    bestInteractionType: bestType.type,
    bestTypeEffectiveness: Math.round(bestType.score * 10) / 10,
    recommendations: {
      focusOn: bestType.type,
      adjustFrequency: avgEffectiveness > 7 ? 'maintain' : 'reduce',
    }
  }
}