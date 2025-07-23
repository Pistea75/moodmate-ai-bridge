import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Target } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Goal {
  id: string;
  title: string;
  description: string;
  target_value: number;
  current_value: number;
  category: 'mood' | 'tasks' | 'sessions' | 'exercises';
  created_at: string;
  target_date: string;
  ai_suggestions?: string[];
}

interface GoalFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (goal: Omit<Goal, 'id' | 'created_at' | 'current_value'>) => void;
  initialData?: string; // For AI suggestions
}

export function GoalForm({ open, onClose, onSubmit, initialData }: GoalFormProps) {
  const [title, setTitle] = useState(initialData || '');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'mood' | 'tasks' | 'sessions' | 'exercises'>('mood');
  const [targetValue, setTargetValue] = useState(7);
  const [targetDate, setTargetDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetDate) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim(),
        category,
        target_value: targetValue,
        target_date: targetDate.toISOString(),
        ai_suggestions: ['Stay consistent', 'Track your progress', 'Celebrate small wins']
      });
      handleClose();
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setCategory('mood');
    setTargetValue(7);
    setTargetDate(undefined);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mood': return '😊';
      case 'tasks': return '✅';
      case 'sessions': return '📅';
      case 'exercises': return '💪';
      default: return '🎯';
    }
  };

  return (
    <Dialog open={open} onOpenChange={open => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-purple-600" />
            Create New Goal
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Goal Title*</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your goal..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal in detail..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category*</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mood">
                    <span className="flex items-center gap-2">
                      😊 Mood
                    </span>
                  </SelectItem>
                  <SelectItem value="tasks">
                    <span className="flex items-center gap-2">
                      ✅ Tasks
                    </span>
                  </SelectItem>
                  <SelectItem value="sessions">
                    <span className="flex items-center gap-2">
                      📅 Sessions
                    </span>
                  </SelectItem>
                  <SelectItem value="exercises">
                    <span className="flex items-center gap-2">
                      💪 Exercises
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target">Target Value*</Label>
              <Input
                id="target"
                type="number"
                min="1"
                max="100"
                value={targetValue}
                onChange={(e) => setTargetValue(parseInt(e.target.value) || 1)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Date*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !targetDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP") : "Select target date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title.trim() || !targetDate}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}