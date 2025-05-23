
// Alert triggers and thresholds for mood monitoring
export const CRITICAL_SCORE = 2;
export const HIGH_RISK_TRIGGERS = ['suicidal thoughts', 'panic attack', 'isolation'];

export function isHighRiskMood(score: number, triggers: string[] = []): boolean {
  const normalized = triggers.map(t => t.trim().toLowerCase());
  return (
    score <= CRITICAL_SCORE &&
    normalized.some(t => HIGH_RISK_TRIGGERS.includes(t))
  );
}
