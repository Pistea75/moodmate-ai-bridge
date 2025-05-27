
export const TRIGGER_RECOMMENDATIONS: Record<string, string> = {
  'stress': 'Would you like to try a 2-minute breathing exercise?',
  'anxiety': 'Would you like to try a grounding technique?',
  'panic attack': 'Consider using the 5-4-3-2-1 coping method.',
  'fatigue': 'Try taking a short mindful break or stretching.',
  'isolation': 'Would journaling or reaching out to someone help?',
  'sadness': 'Would you like a music suggestion or self-care idea?',
  'overwhelm': 'Would you like to try breaking tasks into smaller steps?',
  'anger': 'Consider taking a few deep breaths or a short walk.',
  'loneliness': 'Would reaching out to a friend or loved one help?',
  'worry': 'Would writing down your worries help you process them?',
};

export function getTriggerSuggestion(triggers: string[]): string | null {
  for (const trigger of triggers) {
    const key = trigger.trim().toLowerCase();
    if (TRIGGER_RECOMMENDATIONS[key]) {
      return TRIGGER_RECOMMENDATIONS[key];
    }
  }
  return null;
}
