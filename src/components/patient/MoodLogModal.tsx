
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';

// Import mood components
import { moodFormSchema, MoodFormValues } from './mood/MoodFormSchema';
import { MoodSlider } from './mood/MoodSlider';
import { MoodTriggers } from './mood/MoodTriggers';
import { MoodNotes } from './mood/MoodNotes';
import { useMoodSubmit } from './mood/useMoodSubmit';

interface MoodLogModalProps {
  onLogComplete?: () => void;
  trigger?: React.ReactNode;
}

export function MoodLogModal({ onLogComplete, trigger }: MoodLogModalProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  // Initialize form with default values
  const form = useForm<MoodFormValues>({
    resolver: zodResolver(moodFormSchema),
    defaultValues: {
      mood_score: 5,
      notes: '',
      triggers: [],
      custom_trigger: '',
      activities: [],
    },
  });

  // Handle form submission
  const { handleSubmit, isSubmitting } = useMoodSubmit({
    onComplete: () => {
      setOpen(false);
      form.reset({
        mood_score: 5,
        notes: '',
        triggers: [],
        custom_trigger: '',
        activities: [],
      });
      onLogComplete?.();
    },
    userId: user?.id,
  });

  const onSubmit = async (values: MoodFormValues) => {
    await handleSubmit(values);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default">Log Mood</Button>}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0 m-4 my-8">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">How are you feeling?</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 py-5 space-y-6">
            <div className="space-y-4">
              {/* Mood Score Slider */}
              <MoodSlider form={form} />

              {/* Triggers */}
              <MoodTriggers form={form} />

              {/* Notes */}
              <MoodNotes form={form} />
            </div>

            <DialogFooter className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-mood-purple hover:bg-mood-purple/90 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Entry"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
