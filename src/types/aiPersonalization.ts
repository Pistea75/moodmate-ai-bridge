
export interface AIPreferences {
  tone: string;
  strategies: string;
  triggersToAvoid: string;
  motivators: string;
  dosAndDonts: string;
  diagnosis?: string;
  personality_traits?: string;
  helpful_strategies?: string;
  things_to_avoid?: string;
  clinical_goals?: string;
}

export function isValidAIPreferences(data: any): data is AIPreferences {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.tone === 'string' &&
    typeof data.strategies === 'string' &&
    typeof data.triggersToAvoid === 'string' &&
    typeof data.motivators === 'string' &&
    typeof data.dosAndDonts === 'string'
  );
}

export function getDefaultAIPreferences(): AIPreferences {
  return {
    tone: '',
    strategies: '',
    triggersToAvoid: '',
    motivators: '',
    dosAndDonts: '',
    diagnosis: '',
    personality_traits: '',
    helpful_strategies: '',
    things_to_avoid: '',
    clinical_goals: ''
  };
}
