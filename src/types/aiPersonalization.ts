
export interface AIPreferences {
  tone: string;
  strategies: string;
  triggersToAvoid: string;
  motivators: string;
  dosAndDonts: string;
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
    dosAndDonts: ''
  };
}
