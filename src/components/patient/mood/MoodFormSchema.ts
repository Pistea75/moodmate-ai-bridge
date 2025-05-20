
import { z } from 'zod';

export const moodFormSchema = z.object({
  mood_score: z.number().min(1).max(10),
  notes: z.string().optional(),
  triggers: z.array(z.string()),
  custom_trigger: z.string().optional(),
});

export type MoodFormValues = z.infer<typeof moodFormSchema>;
