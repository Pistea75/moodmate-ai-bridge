
// lib/analyzeMoodTriggers.ts
export function getMostCommonTriggers(entries: { triggers?: string[] | null }[]): string[] {
  const triggerCount: Record<string, number> = {};

  for (const entry of entries) {
    if (!entry.triggers) continue;
    for (const trigger of entry.triggers) {
      const trimmed = trigger.trim().toLowerCase();
      if (!trimmed) continue;
      triggerCount[trimmed] = (triggerCount[trimmed] || 0) + 1;
    }
  }

  const sorted = Object.entries(triggerCount).sort((a, b) => b[1] - a[1]);
  return sorted.slice(0, 3).map(([trigger]) => trigger);
}
