import { useState, useEffect } from 'react';
import { Brodi3DCharacter } from './Brodi3DCharacter';
import { useBrodiInteractions } from '@/hooks/useBrodiInteractions';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BrodiEngineProps {
  context?: 'dashboard' | 'mood' | 'tasks' | 'sessions';
}

export function BrodiEngine({ context = 'dashboard' }: BrodiEngineProps) {
  const { user } = useAuth();
  const { 
    recordInteraction, 
    updateInteractionResponse, 
    shouldShowBrodi,
    preferences 
  } = useBrodiInteractions();
  
  const [currentInteraction, setCurrentInteraction] = useState<{
    id: string;
    type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder';
    message: string;
  } | null>(null);

  const [userStats, setUserStats] = useState<{
    lastMoodEntry?: Date;
    incompleteTasks: number;
    recentAchievements: number;
    moodStreak: number;
  }>({
    incompleteTasks: 0,
    recentAchievements: 0,
    moodStreak: 0,
  });

  // Load user stats for AI decision making
  useEffect(() => {
    if (!user) return;

    const loadUserStats = async () => {
      try {
        // Get last mood entry
        const { data: moodData } = await supabase
          .from('mood_entries')
          .select('created_at')
          .eq('patient_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        // Get incomplete tasks count
        const { count: incompleteTasksCount } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', user.id)
          .eq('completed', false);

        // Get recent completed tasks (achievements)
        const { count: recentAchievements } = await supabase
          .from('tasks')
          .select('*', { count: 'exact', head: true })
          .eq('patient_id', user.id)
          .eq('completed', true)
          .gte('inserted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        // Calculate mood streak (consecutive days with mood entries)
        const { data: recentMoods } = await supabase
          .from('mood_entries')
          .select('created_at')
          .eq('patient_id', user.id)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        let streak = 0;
        if (recentMoods && recentMoods.length > 0) {
          const today = new Date();
          let currentDate = new Date(today);
          
          for (const mood of recentMoods) {
            const moodDate = new Date(mood.created_at);
            if (moodDate.toDateString() === currentDate.toDateString()) {
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }

        setUserStats({
          lastMoodEntry: moodData ? new Date(moodData.created_at) : undefined,
          incompleteTasks: incompleteTasksCount || 0,
          recentAchievements: recentAchievements || 0,
          moodStreak: streak,
        });
      } catch (error) {
        console.error('Error loading user stats:', error);
      }
    };

    loadUserStats();
  }, [user]);

  // Manual call function
  const callBrodi = () => {
    if (currentInteraction) return; // Don't call if already showing
    
    const welcomeMessages = [
      "Hi there! I'm here to help. What's on your mind today? 😊",
      "Hello! How can I support your wellness journey today?",
      "Hey! I'm glad you called me. What would you like to talk about?",
    ];
    
    showBrodiInteraction('random', welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
  };

  // AI-powered decision engine for when Brodi should appear (reduced frequency)
  useEffect(() => {
    if (!user || !preferences || currentInteraction) return;

    const checkForBrodiInteraction = () => {
      const now = new Date();
      const hoursSinceLastMood = userStats.lastMoodEntry 
        ? (now.getTime() - userStats.lastMoodEntry.getTime()) / (1000 * 60 * 60)
        : 168; // Default to 7 days if no mood entries

      // Only show automatic interactions occasionally and with more restrictive conditions
      
      // Mood reminder logic (only after 48 hours, not 24)
      if (shouldShowBrodi('mood_reminder') && hoursSinceLastMood > 48 && Math.random() < 0.3) {
        const messages = [
          "Hey! It's been a while since your last mood check-in. How are you feeling today?",
          "I noticed you haven't logged your mood recently. A quick check-in can be really helpful! 💙",
        ];
        
        showBrodiInteraction('mood_reminder', messages[Math.floor(Math.random() * messages.length)]);
        return;
      }

      // Celebration logic (only for significant achievements)
      if (shouldShowBrodi('celebration') && userStats.recentAchievements > 2 && Math.random() < 0.5) {
        const messages = [
          `Amazing! You've completed ${userStats.recentAchievements} tasks this week! 🎉`,
          "You're doing great! Keep up the excellent progress! ✨",
        ];
        
        showBrodiInteraction('celebration', messages[Math.floor(Math.random() * messages.length)]);
        return;
      }

      // Task reminder logic (only for many incomplete tasks)
      if (shouldShowBrodi('task_reminder') && userStats.incompleteTasks > 5 && Math.random() < 0.2) {
        const messages = [
          `You have ${userStats.incompleteTasks} pending tasks. Small steps lead to big changes! 📝`,
          "Ready to tackle some tasks? You've got this! 💪",
        ];
        
        showBrodiInteraction('task_reminder', messages[Math.floor(Math.random() * messages.length)]);
        return;
      }
    };

    // Much less frequent automatic checks - every 5-10 minutes
    const interval = setInterval(checkForBrodiInteraction, Math.random() * 300000 + 300000); // 5-10 minutes

    return () => clearInterval(interval);
  }, [user, preferences, userStats, currentInteraction, context, shouldShowBrodi]);

  const showBrodiInteraction = async (
    type: 'nudge' | 'celebration' | 'random' | 'mood_reminder' | 'task_reminder',
    message: string
  ) => {
    const interactionId = await recordInteraction(type, message, { 
      context,
      userStats,
      timestamp: new Date().toISOString(),
    });

    if (interactionId) {
      setCurrentInteraction({
        id: interactionId,
        type,
        message,
      });
    }
  };

  const handleDismiss = () => {
    if (currentInteraction) {
      updateInteractionResponse(currentInteraction.id, 'dismissed');
      setCurrentInteraction(null);
    }
  };

  const handleEngaged = () => {
    if (currentInteraction) {
      updateInteractionResponse(currentInteraction.id, 'engaged', 8); // High effectiveness for engagement
      setCurrentInteraction(null);
    }
  };

  const handleActionCompleted = () => {
    if (currentInteraction) {
      updateInteractionResponse(currentInteraction.id, 'completed_action', 10); // Maximum effectiveness
      setCurrentInteraction(null);
    }
  };

  return {
    callBrodi,
    brodiComponent: currentInteraction ? (
      <Brodi3DCharacter
        message={currentInteraction.message}
        type={currentInteraction.type}
        onDismiss={handleDismiss}
        onEngaged={handleEngaged}
        onActionCompleted={handleActionCompleted}
      />
    ) : null
  };
}