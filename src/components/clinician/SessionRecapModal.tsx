
import { useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SessionRecapModal({
  sessionId,
  initialNotes = '',
  onSaved,
}: {
  sessionId: string;
  initialNotes?: string;
  onSaved?: () => void;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('sessions')
      .update({ notes })
      .eq('id', sessionId);

    setLoading(false);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save notes',
        description: error.message,
      });
    } else {
      toast({
        title: 'Notes saved',
        description: 'Session recap has been saved successfully.',
      });
      onSaved?.();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Add Recap</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Session Recap</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="session-notes">Notes and Observations</Label>
          <Textarea
            id="session-notes"
            placeholder="Write recap or observations here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Recap'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
