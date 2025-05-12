
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function MoodLogModal({ onLogComplete }: { onLogComplete?: () => void }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [triggers, setTriggers] = useState('');

  const handleSubmit = async () => {
    if (!score) {
      toast({ variant: 'destructive', title: 'Please select a mood score.' });
      return;
    }

    const { error } = await supabase.from('mood_entries').insert({
      mood_score: score,
      notes,
      triggers: triggers ? triggers.split(',').map(t => t.trim()) : [],
    });

    if (error) {
      toast({ variant: 'destructive', title: 'Error logging mood', description: error.message });
    } else {
      toast({ title: 'Mood logged successfully' });
      setOpen(false);
      setScore(null);
      setNotes('');
      setTriggers('');
      onLogComplete?.();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Log Mood</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <div>
          <Label>Mood Score (1–10)</Label>
          <Input
            type="number"
            min={1}
            max={10}
            value={score ?? ''}
            onChange={(e) => setScore(Number(e.target.value))}
          />
        </div>

        <div>
          <Label>Notes (optional)</Label>
          <Textarea
            placeholder="Describe how you're feeling..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div>
          <Label>Triggers (comma-separated)</Label>
          <Input
            placeholder="e.g. stress, work, lack of sleep"
            value={triggers}
            onChange={(e) => setTriggers(e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">Submit Entry</Button>
      </DialogContent>
    </Dialog>
  );
}
