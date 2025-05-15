
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
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

// Common mood triggers that patients might experience
const commonTriggers = [
  { label: 'Stress', value: 'stress' },
  { label: 'Work', value: 'work' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Relationships', value: 'relationships' },
  { label: 'Health', value: 'health' }
];

export function MoodLogModal({ onLogComplete }: { onLogComplete?: () => void }) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'You need to be logged in to log your mood.' });
      return;
    }

    // Combine selected triggers with any custom trigger
    const allTriggers = [...selectedTriggers];
    if (customTrigger.trim()) {
      allTriggers.push(customTrigger.trim());
    }

    const { error } = await supabase.from('mood_entries').insert({
      mood_score: score,
      notes,
      triggers: allTriggers,
      patient_id: user.id,
    });

    if (error) {
      console.error('Error logging mood:', error);
      toast({ variant: 'destructive', title: 'Error logging mood', description: error.message });
    } else {
      toast({ title: 'Mood logged successfully' });
      setOpen(false);
      setScore(5);
      setNotes('');
      setSelectedTriggers([]);
      setCustomTrigger('');
      onLogComplete?.();
    }
  };

  const toggleTrigger = (value: string) => {
    setSelectedTriggers(prev => 
      prev.includes(value) 
        ? prev.filter(t => t !== value) 
        : [...prev, value]
    );
  };

  const getMoodLabel = (score: number) => {
    if (score <= 3) return "Low";
    if (score <= 7) return "Moderate";
    return "High";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Log Mood</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl">How are you feeling?</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Mood Score: {score}</Label>
            <span className="text-sm font-medium">{getMoodLabel(score)}</span>
          </div>
          <Slider 
            value={[score]} 
            min={1} 
            max={10} 
            step={1} 
            onValueChange={(values) => setScore(values[0])} 
            className="py-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Triggers</Label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {commonTriggers.map(trigger => (
              <div key={trigger.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={trigger.value} 
                  checked={selectedTriggers.includes(trigger.value)}
                  onCheckedChange={() => toggleTrigger(trigger.value)}
                />
                <Label htmlFor={trigger.value} className="cursor-pointer">{trigger.label}</Label>
              </div>
            ))}
          </div>
          <Input
            placeholder="Other trigger (optional)"
            value={customTrigger}
            onChange={(e) => setCustomTrigger(e.target.value)}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="mb-2 block">Notes (optional)</Label>
          <Textarea
            placeholder="Describe how you're feeling..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">Submit Entry</Button>
      </DialogContent>
    </Dialog>
  );
}
