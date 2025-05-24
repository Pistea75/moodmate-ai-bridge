
export interface AIPreferences {
  challenges: string;
  strategies: string;
  tone: string;
  emergency: string;
}

export function isValidAIPreferences(data: any): data is AIPreferences {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.challenges === 'string' &&
    typeof data.strategies === 'string' &&
    typeof data.tone === 'string' &&
    typeof data.emergency === 'string'
  );
}

export function getDefaultAIPreferences(): AIPreferences {
  return {
    challenges: '',
    strategies: '',
    tone: '',
    emergency: ''
  };
}
