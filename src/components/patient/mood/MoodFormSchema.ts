
import { z } from 'zod';

/**
 * Schema definition for the mood logging form
 * - mood_score: Integer between 1-10 representing mood level
 * - notes: Optional text field for additional context
 * - triggers: Array of trigger identifiers affecting mood
 * - custom_trigger: Optional user-defined trigger
 * - activities: Optional array of activities that affected mood (new field)
 */
export const moodFormSchema = z.object({
  mood_score: z.number().min(1).max(10),
  notes: z.string().optional(),
  triggers: z.array(z.string()),
  custom_trigger: z.string().optional(),
  activities: z.array(z.string()).optional(),
});

export type MoodFormValues = z.infer<typeof moodFormSchema>;
