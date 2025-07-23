import { useState, useEffect } from 'react';
import { BrodiCharacter } from './BrodiCharacter';
import { useBrodiInteractions } from '@/hooks/useBrodiInteractions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BrodiNudgeSystemProps {
  context?: 'mood_logging' | 'task_completion' | 'session_prep' | 'goal_setting';
  trigger?: {
    type: 'page_visit' | 'idle_time' | 'pattern_detected' | 'manual';
    data?: any;
  };
}

export function BrodiNudgeSystem({ context, trigger }: BrodiNudgeSystemProps) {
  const { user } = useAuth();
  const { recordInteraction, updateInteractionResponse, shouldShowBrodi } = useBrodiInteractions();
  
  const [activeNudge, setActiveNudge] = useState<{
    id: string;
    type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (user && trigger && !activeNudge) {
      handleNudgeTrigger();
    }
  }, [user, trigger, context, activeNudge]);

  const handleNudgeTrigger = async () => {
    if (!user || !trigger) return;

    try {
      // Call the timing optimizer to see if we should show a nudge
      const { data: optimization, error } = await supabase.functions.invoke('brodi-timing-optimizer', {
        body: {
          userId: user.id,
          interactionType: getInteractionTypeFromContext(context),
          currentContext: {
            timeOfDay: new Date().toLocaleTimeString(),
            dayOfWeek: new Date().toLocaleDateString('en', { weekday: 'long' }),
            userActivity: context,
            triggerType: trigger.type,
            triggerData: trigger.data
          }
        }
      });

      if (error) {
        console.error('Error optimizing timing:', error);
        return;
      }

      if (!optimization.shouldSchedule) {
        console.log('Brodi timing optimizer:', optimization.reasoning);
        return;
      }

      // Generate personalized message
      const { data: messageData, error: messageError } = await supabase.functions.invoke('brodi-message-generator', {
        body: {
          userId: user.id,
          interactionType: getInteractionTypeFromContext(context),
          context: {
            currentContext: context,
            triggerType: trigger.type,
            triggerData: trigger.data,
            timeOfDay: getTimeOfDay(),
          }
        }
      });

      if (messageError) {
        console.error('Error generating message:', messageError);
        return;
      }

      const interactionType = getInteractionTypeFromContext(context);
      if (!shouldShowBrodi(interactionType)) return;

      // Show the nudge
      const message = messageData.message || getDefaultMessage(context, trigger);
      const interactionId = await recordInteraction(interactionType, message, {
        context,
        trigger,
        optimization,
        enhanced: messageData.enhanced
      });

      if (interactionId) {
        setActiveNudge({
          id: interactionId,
          type: interactionType,
          message
        });
      }
    } catch (error) {
      console.error('Error in nudge system:', error);
    }
  };

  const getInteractionTypeFromContext = (context?: string): 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder' => {
    switch (context) {
      case 'mood_logging':
        return 'mood_reminder';
      case 'task_completion':
        return 'task_reminder';
      case 'session_prep':
        return 'nudge';
      case 'goal_setting':
        return 'nudge';
      default:
        return 'random';
    }
  };

  const getDefaultMessage = (context?: string, trigger?: any): string => {
    const messages = {
      mood_logging: [
        "How are you feeling today? Your emotional check-in matters! 💙",
        "Taking a moment to reflect on your mood can be really helpful.",
        "Ready to log your mood? Every entry helps track your progress!"
      ],
      task_completion: [
        "You've got some tasks waiting! Small steps lead to big changes 📝",
        "Ready to tackle something on your list? You can do this! 💪",
        "Each completed task is progress toward your goals!"
      ],
      session_prep: [
        "Your upcoming session is a great opportunity for growth 🌱",
        "Taking time to prepare can make your session even more valuable.",
        "Reflecting before your session can help you get the most out of it."
      ],
      goal_setting: [
        "Setting meaningful goals is an important step in your journey! 🎯",
        "What would you like to work toward? I'm here to help!",
        "Clear goals can provide direction and motivation."
      ]
    };

    const contextMessages = messages[context as keyof typeof messages] || [
      "You're doing great on your mental health journey! 💙"
    ];

    return contextMessages[Math.floor(Math.random() * contextMessages.length)];
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  const handleDismiss = () => {
    if (activeNudge) {
      updateInteractionResponse(activeNudge.id, 'dismissed');
      setActiveNudge(null);
    }
  };

  const handleEngaged = () => {
    if (activeNudge) {
      updateInteractionResponse(activeNudge.id, 'engaged', 8);
      setActiveNudge(null);
    }
  };

  const handleActionCompleted = () => {
    if (activeNudge) {
      updateInteractionResponse(activeNudge.id, 'completed_action', 10);
      setActiveNudge(null);
    }
  };

  if (!activeNudge) return null;

  return (
    <BrodiCharacter
      message={activeNudge.message}
      type={activeNudge.type}
      onDismiss={handleDismiss}
      onEngaged={handleEngaged}
      onActionCompleted={handleActionCompleted}
    />
  );
}