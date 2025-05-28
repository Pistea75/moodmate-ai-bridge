
// Exercise detection utilities for AI chat
export function isExerciseRecommendation(text: string): boolean {
  const exerciseKeywords = [
    'try this exercise',
    'practice this',
    'breathing technique', 
    'grounding technique',
    'coping strategy',
    'mindfulness exercise',
    'relaxation technique',
    'deep breathing',
    'meditation',
    'journaling',
    'progressive muscle relaxation',
    'visualization',
    'try the',
    'would you like to try',
    'i recommend',
    'let\'s practice'
  ];
  
  const lowerText = text.toLowerCase();
  return exerciseKeywords.some(keyword => lowerText.includes(keyword));
}

export function isUserConfirmation(text: string): boolean {
  const confirmationPatterns = [
    /i (did|completed|finished|tried) (it|the exercise|that|the technique)/i,
    /yes,? i (did|tried|completed)/i,
    /i have (done|tried|completed)/i,
    /(yes|yeah),? i did/i,
    /completed it/i,
    /finished it/i,
    /tried it/i
  ];
  
  return confirmationPatterns.some(pattern => pattern.test(text));
}

export function isUserDenial(text: string): boolean {
  const denialPatterns = [
    /i (didn't|did not|haven't|have not) (do|complete|try|finish)/i,
    /no,? i (didn't|haven't|did not)/i,
    /i (forgot|couldn't|wasn't able)/i,
    /(no|nope),? i didn't/i,
    /haven't tried/i,
    /didn't get/i
  ];
  
  return denialPatterns.some(pattern => pattern.test(text));
}

export function extractExerciseFromText(text: string): string {
  // Try to extract the actual exercise recommendation from AI text
  const sentences = text.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    if (isExerciseRecommendation(sentence.trim())) {
      return sentence.trim();
    }
  }
  
  return text; // fallback to full text if no specific exercise found
}
