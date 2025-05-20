
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { X } from 'lucide-react';
import { Form, FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Common mood triggers that patients might experience
const commonTriggers = [
  { label: 'Stress', value: 'stress' },
  { label: 'Work', value: 'work' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Relationships', value: 'relationships' },
  { label: 'Health', value: 'health' }
];

// Form schema
const moodFormSchema = z.object({
  mood_score: z.number().min(1).max(10),
  notes: z.string().optional(),
  triggers: z.array(z.string()),
  custom_trigger: z.string().optional(),
});

type MoodFormValues = z.infer<typeof moodFormSchema>;

export function MoodLogModal({ onLogComplete }: { onLogComplete?: () => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<MoodFormValues>({
    resolver: zodResolver(moodFormSchema),
    defaultValues: {
      mood_score: 5,
      notes: '',
      triggers: [],
      custom_trigger: '',
    },
  });

  const handleSubmit = async (values: MoodFormValues) => {
    if (!user) {
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
        patient_id: user.id,
      });

      if (error) {
        console.error('Error logging mood:', error);
        toast({ variant: 'destructive', title: 'Error logging mood', description: error.message });
      } else {
        toast({ title: 'Mood logged successfully' });
        setOpen(false);
        form.reset({
          mood_score: 5,
          notes: '',
          triggers: [],
          custom_trigger: '',
        });
        onLogComplete?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return "Low";
    if (score <= 7) return "Moderate";
    return "High";
  };

  const toggleTrigger = (value: string) => {
    const currentTriggers = form.getValues('triggers');
    const updatedTriggers = currentTriggers.includes(value)
      ? currentTriggers.filter(t => t !== value)
      : [...currentTriggers, value];
    
    form.setValue('triggers', updatedTriggers, { shouldValidate: true });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Log Mood</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white rounded-xl shadow-2xl overflow-hidden p-0 border-0 m-4 my-8">
        <DialogHeader className="border-b px-6 py-4 bg-white">
          <DialogTitle className="text-xl font-semibold text-gray-900">How are you feeling?</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-full hover:bg-gray-100 p-1">
            <X className="h-5 w-5" />
          </DialogClose>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-5 space-y-6">
            <div className="space-y-4">
              {/* Mood Score Slider */}
              <FormField
                control={form.control}
                name="mood_score"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label>Mood Score: {field.value}</Label>
                      <span className="text-sm font-medium">{getMoodLabel(field.value)}</span>
                    </div>
                    <FormControl>
                      <Slider 
                        value={[field.value]} 
                        min={1} 
                        max={10} 
                        step={1} 
                        onValueChange={(values) => field.onChange(values[0])} 
                        className="py-4"
                      />
                    </FormControl>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </FormItem>
                )}
              />

              {/* Triggers */}
              <div className="space-y-2">
                <Label className="block text-gray-700 font-medium">Triggers</Label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {commonTriggers.map(trigger => (
                    <div key={trigger.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={trigger.value} 
                        checked={form.watch('triggers').includes(trigger.value)}
                        onCheckedChange={() => toggleTrigger(trigger.value)}
                      />
                      <Label htmlFor={trigger.value} className="cursor-pointer">{trigger.label}</Label>
                    </div>
                  ))}
                </div>
                <FormField
                  control={form.control}
                  name="custom_trigger"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Other trigger (optional)"
                          {...field}
                          className="mt-2"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <Label className="block text-gray-700 font-medium">Notes (optional)</Label>
                    <FormControl>
                      <Textarea
                        placeholder="Describe how you're feeling..."
                        {...field}
                        className="mt-2"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
