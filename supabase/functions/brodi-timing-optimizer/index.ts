import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TimingOptimizationRequest {
  userId: string;
  interactionType: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
  currentContext?: {
    timeOfDay: string;
    dayOfWeek: string;
    userActivity: string;
    recentMoodScore?: number;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { userId, interactionType, currentContext }: TimingOptimizationRequest = await req.json();

    console.log('Optimizing timing for user:', userId, 'type:', interactionType);

    // Get user preferences
    const { data: preferences } = await supabaseClient
      .from('brodi_user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Get historical interaction data for pattern analysis
    const { data: historicalData } = await supabaseClient
      .from('brodi_interactions')
      .select('*')
      .eq('user_id', userId)
      .eq('interaction_type', interactionType)
      .order('created_at', { ascending: false })
      .limit(50);

    // Get recent nudge history to avoid over-nudging
    const { data: recentNudges } = await supabaseClient
      .from('brodi_nudge_history')
      .select('*')
      .eq('user_id', userId)
      .gte('scheduled_time', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order('scheduled_time', { ascending: false });

    // Get pattern analysis for this user
    const { data: patterns } = await supabaseClient
      .from('brodi_pattern_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('confidence_score', { ascending: false });

    // Calculate optimal timing
    const optimization = calculateOptimalTiming(
      interactionType,
      historicalData || [],
      recentNudges || [],
      patterns || [],
      preferences,
      currentContext
    );

    // Log the nudge decision for future learning
    if (optimization.shouldSchedule) {
      await supabaseClient
        .from('brodi_nudge_history')
        .insert([{
          user_id: userId,
          nudge_type: interactionType,
          scheduled_time: optimization.scheduledTime,
          context_score: optimization.contextScore,
        }]);
    }

    return new Response(
      JSON.stringify(optimization),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in brodi-timing-optimizer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function calculateOptimalTiming(
  interactionType: string,
  historicalData: any[],
  recentNudges: any[],
  patterns: any[],
  preferences: any,
  currentContext?: any
): {
  shouldSchedule: boolean;
  scheduledTime: string;
  contextScore: number;
  reasoning: string;
  delayMinutes?: number;
} {
  const now = new Date();
  const currentHour = now.getHours();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.

  // Check quiet hours
  if (preferences?.quiet_hours_start && preferences?.quiet_hours_end) {
    const quietStart = parseTime(preferences.quiet_hours_start);
    const quietEnd = parseTime(preferences.quiet_hours_end);
    
    if (isInQuietHours(currentHour, quietStart, quietEnd)) {
      return {
        shouldSchedule: false,
        scheduledTime: '',
        contextScore: 0,
        reasoning: 'User is in quiet hours'
      };
    }
  }

  // Check frequency preferences
  const frequencyLimits = getFrequencyLimits(preferences?.frequency_preference || 'normal');
  const recentCount = recentNudges.filter(n => n.nudge_type === interactionType).length;
  
  if (recentCount >= frequencyLimits.daily) {
    return {
      shouldSchedule: false,
      scheduledTime: '',
      contextScore: 0,
      reasoning: `Daily limit reached for ${interactionType} (${recentCount}/${frequencyLimits.daily})`
    };
  }

  // Analyze historical patterns for optimal timing
  const optimalHour = findOptimalHour(historicalData, interactionType);
  const hourScore = calculateHourScore(currentHour, optimalHour);

  // Calculate context score based on various factors
  let contextScore = 0.5; // Base score

  // Time of day scoring
  contextScore += hourScore * 0.3;

  // Day of week patterns
  const dayPattern = patterns.find(p => p.pattern_type === 'engagement' && 
    p.analysis_data?.day_of_week_preferences);
  if (dayPattern?.analysis_data?.day_of_week_preferences?.[currentDay]) {
    contextScore += dayPattern.analysis_data.day_of_week_preferences[currentDay] * 0.2;
  }

  // Recent mood context (for mood-related interactions)
  if (interactionType === 'mood_reminder' && currentContext?.recentMoodScore) {
    if (currentContext.recentMoodScore <= 3) {
      contextScore += 0.2; // More likely to nudge when mood is low
    }
  }

  // Task completion context
  if (interactionType === 'task_reminder') {
    const taskPattern = patterns.find(p => p.pattern_type === 'task_completion');
    if (taskPattern?.analysis_data?.best_hour === currentHour) {
      contextScore += 0.25;
    }
  }

  // Recent interaction spacing (avoid too frequent interactions)
  const lastInteraction = recentNudges[0];
  if (lastInteraction) {
    const hoursSince = (now.getTime() - new Date(lastInteraction.scheduled_time).getTime()) / (1000 * 60 * 60);
    if (hoursSince < 2) {
      contextScore -= 0.3; // Reduce score for recent interactions
    }
  }

  // Determine if we should schedule
  const threshold = getContextThreshold(interactionType, preferences?.frequency_preference);
  const shouldSchedule = contextScore >= threshold;

  let scheduledTime = now.toISOString();
  let delayMinutes = 0;

  // If context score is marginal, consider delaying
  if (shouldSchedule && contextScore < threshold + 0.1) {
    const betterHour = findNextOptimalHour(optimalHour, currentHour);
    if (betterHour !== currentHour) {
      delayMinutes = (betterHour - currentHour) * 60;
      if (delayMinutes < 0) delayMinutes += 24 * 60; // Next day
      
      const delayedTime = new Date(now.getTime() + delayMinutes * 60 * 1000);
      scheduledTime = delayedTime.toISOString();
    }
  }

  return {
    shouldSchedule,
    scheduledTime,
    contextScore: Math.round(contextScore * 100) / 100,
    reasoning: generateReasoning(shouldSchedule, contextScore, hourScore, recentCount, interactionType),
    delayMinutes: delayMinutes > 0 ? delayMinutes : undefined
  };
}

function parseTime(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
}

function isInQuietHours(currentHour: number, quietStart: number, quietEnd: number): boolean {
  if (quietStart < quietEnd) {
    return currentHour >= quietStart && currentHour < quietEnd;
  } else {
    // Quiet hours span midnight
    return currentHour >= quietStart || currentHour < quietEnd;
  }
}

function getFrequencyLimits(preference: string): { daily: number; hourly: number } {
  switch (preference) {
    case 'minimal':
      return { daily: 1, hourly: 1 };
    case 'frequent':
      return { daily: 5, hourly: 2 };
    case 'normal':
    default:
      return { daily: 3, hourly: 1 };
  }
}

function findOptimalHour(historicalData: any[], interactionType: string): number {
  if (historicalData.length === 0) return 14; // Default to 2 PM

  const hourCounts: Record<number, number> = {};
  const hourEffectiveness: Record<number, number[]> = {};

  historicalData.forEach(interaction => {
    const hour = new Date(interaction.created_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    
    if (interaction.effectiveness_score) {
      if (!hourEffectiveness[hour]) hourEffectiveness[hour] = [];
      hourEffectiveness[hour].push(interaction.effectiveness_score);
    }
  });

  // Find hour with best effectiveness, weighted by frequency
  let bestHour = 14;
  let bestScore = 0;

  Object.keys(hourCounts).forEach(hourStr => {
    const hour = parseInt(hourStr);
    const frequency = hourCounts[hour];
    const effectiveness = hourEffectiveness[hour]?.length > 0 
      ? hourEffectiveness[hour].reduce((a, b) => a + b) / hourEffectiveness[hour].length
      : 5; // Default effectiveness

    const score = (effectiveness / 10) * Math.log(frequency + 1);
    if (score > bestScore) {
      bestScore = score;
      bestHour = hour;
    }
  });

  return bestHour;
}

function calculateHourScore(currentHour: number, optimalHour: number): number {
  const diff = Math.abs(currentHour - optimalHour);
  const minDiff = Math.min(diff, 24 - diff);
  return Math.max(0, 1 - minDiff / 6); // Score decreases as we get further from optimal
}

function findNextOptimalHour(optimalHour: number, currentHour: number): number {
  // If we're within 2 hours of optimal, use optimal
  const diff = Math.abs(currentHour - optimalHour);
  if (diff <= 2 || diff >= 22) return optimalHour;
  
  // Otherwise, find the next reasonable hour (not too late/early)
  if (currentHour < 8) return 9; // Morning
  if (currentHour > 20) return optimalHour; // Use optimal next day
  
  return Math.min(optimalHour, 18); // Don't go too late
}

function getContextThreshold(interactionType: string, frequency: string): number {
  const baseThresholds = {
    'mood_reminder': 0.4,
    'celebration': 0.3,
    'task_reminder': 0.5,
    'nudge': 0.6,
    'random': 0.7
  };

  const frequencyModifiers = {
    'minimal': 0.2,
    'normal': 0,
    'frequent': -0.1
  };

  return (baseThresholds[interactionType] || 0.5) + (frequencyModifiers[frequency] || 0);
}

function generateReasoning(
  shouldSchedule: boolean, 
  contextScore: number, 
  hourScore: number, 
  recentCount: number,
  interactionType: string
): string {
  if (!shouldSchedule) {
    if (recentCount > 0) return `Recent ${interactionType} interactions limit reached`;
    if (contextScore < 0.3) return 'Context score too low for effective interaction';
    return 'Not optimal timing for user engagement';
  }

  const reasons = [];
  if (hourScore > 0.7) reasons.push('optimal time window');
  if (contextScore > 0.7) reasons.push('high engagement probability');
  if (recentCount === 0) reasons.push('no recent similar interactions');
  
  return reasons.length > 0 ? reasons.join(', ') : 'conditions favorable for interaction';
}
