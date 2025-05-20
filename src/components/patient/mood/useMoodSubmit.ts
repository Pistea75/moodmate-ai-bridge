
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MoodFormValues } from './MoodFormSchema';

interface UseMoodSubmitProps {
  onComplete?: () => void;
  userId?: string;
}

export const useMoodSubmit = ({ onComplete, userId }: UseMoodSubmitProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: MoodFormValues) => {
    if (!userId) {
      toast({ variant: 'destructive', title: 'You need to be logged in to log your mood.' });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Combine selected triggers with any custom trigger
      const allTriggers = [...values.triggers];
      if (values.custom_trigger?.trim()) {
        allTriggers.push(values.custom_trigger.trim());
      }

      const { error } = await supabase.from('mood_entries').insert({
        mood_score: values.mood_score,
        notes: values.notes,
        triggers: allTriggers,
        patient_id: userId,
      });

      if (error) {
        console.error('Error logging mood:', error);
        toast({ variant: 'destructive', title: 'Error logging mood', description: error.message });
        return false;
      } else {
        toast({ title: 'Mood logged successfully' });
        onComplete?.();
        return true;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};
