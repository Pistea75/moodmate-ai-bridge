import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface MessageGenerationRequest {
  userId: string;
  interactionType: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
  context: {
    currentMood?: number;
    recentTasks?: number;
    moodStreak?: number;
    timeOfDay?: string;
    userPreferences?: {
      interaction_style: 'professional' | 'friendly' | 'casual';
      frequency_preference: 'minimal' | 'normal' | 'frequent';
    };
    patternInsights?: any[];
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

    const { userId, interactionType, context }: MessageGenerationRequest = await req.json();

    console.log('Generating message for user:', userId, 'type:', interactionType);

    // Get user's AI patterns for more personalized messaging
    const { data: patterns } = await supabaseClient
      .from('brodi_pattern_analysis')
      .select('*')
      .eq('user_id', userId)
      .order('confidence_score', { ascending: false });

    // Get recent interaction history to avoid repetition
    const { data: recentInteractions } = await supabaseClient
      .from('brodi_interactions')
      .select('message, interaction_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    const recentMessages = recentInteractions?.map(i => i.message) || [];

    // Generate personalized message based on context and patterns
    const message = generateContextualMessage(
      interactionType,
      context,
      patterns || [],
      recentMessages,
      context.userPreferences?.interaction_style || 'friendly'
    );

    // Use OpenAI to enhance the message if available
    let enhancedMessage = message;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (openaiApiKey) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
                content: `You are Brodi, an AI mental health companion. Generate a ${context.userPreferences?.interaction_style || 'friendly'} message for a ${interactionType.replace('_', ' ')} interaction. Keep it under 100 characters, warm but professional. Use emojis sparingly. Make it sound natural and supportive.`
              },
              {
                role: 'user',
                content: `Context: ${JSON.stringify(context)}. Base message: "${message}". Recent messages to avoid repeating: ${JSON.stringify(recentMessages)}`
              }
            ],
            max_tokens: 100,
            temperature: 0.7,
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          enhancedMessage = openaiData.choices[0]?.message?.content?.trim() || message;
          console.log('Enhanced message with OpenAI:', enhancedMessage);
        }
      } catch (error) {
        console.error('Error enhancing message with OpenAI:', error);
        // Fall back to generated message
      }
    }

    return new Response(
      JSON.stringify({ 
        message: enhancedMessage,
        metadata: {
          originalMessage: message,
          patterns: patterns?.length || 0,
          enhanced: enhancedMessage !== message
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in brodi-message-generator:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateContextualMessage(
  type: string,
  context: any,
  patterns: any[],
  recentMessages: string[],
  style: string
): string {
  const timeGreeting = getTimeGreeting(context.timeOfDay);
  const styleAdjustment = getStyleAdjustment(style);
  
  // Find relevant patterns
  const moodPattern = patterns.find(p => p.pattern_type === 'mood_timing');
  const taskPattern = patterns.find(p => p.pattern_type === 'task_completion');
  
  let messages: string[] = [];

  switch (type) {
    case 'mood_reminder':
      messages = [
        `${timeGreeting} How are you feeling today? ${styleAdjustment.emoji}`,
        `Time for a quick mood check-in! Your feelings matter ${styleAdjustment.emoji}`,
        `${moodPattern ? "I noticed you usually check in around now." : ""} How's your mood? ${styleAdjustment.emoji}`,
        `Taking a moment to reflect on your feelings can be really helpful ${styleAdjustment.emoji}`,
        `Ready to log how you're feeling? Every check-in helps! ${styleAdjustment.emoji}`
      ];
      break;

    case 'celebration':
      messages = [
        `${context.moodStreak ? `${context.moodStreak} days of mood tracking!` : 'Great progress!'} You're doing amazing! 🎉`,
        `Way to go! ${context.recentTasks ? `${context.recentTasks} tasks completed` : 'Keep up the excellent work'} ✨`,
        `Your dedication to your mental health journey is inspiring! ${styleAdjustment.emoji}`,
        `Small wins add up to big changes. Celebrate yourself! 🌟`,
        `Progress isn't always linear, but you're moving forward! ${styleAdjustment.emoji}`
      ];
      break;

    case 'task_reminder':
      messages = [
        `${taskPattern ? "Based on your patterns, " : ""}ready to tackle some tasks? You've got this! 💪`,
        `Small steps lead to big changes. Which task feels manageable today? ${styleAdjustment.emoji}`,
        `Sometimes the hardest part is just getting started ${styleAdjustment.emoji}`,
        `You've completed tasks before - you can do it again! ${styleAdjustment.emoji}`,
        `${context.recentTasks ? `Building on your recent success!` : 'Every task completed is progress'} ${styleAdjustment.emoji}`
      ];
      break;

    case 'nudge':
      messages = [
        `Remember, progress isn't always linear. Every small step counts! ${styleAdjustment.emoji}`,
        `You're here, you're trying, and that's what matters most ${styleAdjustment.emoji}`,
        `Mental health is a journey, not a destination ${styleAdjustment.emoji}`,
        `Taking care of yourself is an act of self-compassion ${styleAdjustment.emoji}`,
        `Your effort to improve your wellbeing is commendable ${styleAdjustment.emoji}`
      ];
      break;

    case 'random':
      messages = [
        `${timeGreeting} Hope you're having a good ${context.timeOfDay || 'day'}! ${styleAdjustment.emoji}`,
        `Just checking in - you're doing better than you think ${styleAdjustment.emoji}`,
        `Remember to be kind to yourself today ${styleAdjustment.emoji}`,
        `Your mental health journey matters. Keep going! ${styleAdjustment.emoji}`,
        `Taking things one day at a time is perfectly okay ${styleAdjustment.emoji}`
      ];
      break;

    default:
      messages = [`Hi there! How can I support you today? ${styleAdjustment.emoji}`];
  }

  // Filter out recently used messages to avoid repetition
  const availableMessages = messages.filter(msg => 
    !recentMessages.some(recent => 
      msg.toLowerCase().includes(recent.toLowerCase().slice(0, 20))
    )
  );

  const selectedMessages = availableMessages.length > 0 ? availableMessages : messages;
  return selectedMessages[Math.floor(Math.random() * selectedMessages.length)];
}

function getTimeGreeting(timeOfDay?: string): string {
  if (!timeOfDay) return "Hi";
  
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getStyleAdjustment(style: string): { emoji: string; tone: string } {
  switch (style) {
    case 'professional':
      return { emoji: '', tone: 'formal' };
    case 'casual':
      return { emoji: '😊', tone: 'relaxed' };
    case 'friendly':
    default:
      return { emoji: '💙', tone: 'warm' };
  }
}