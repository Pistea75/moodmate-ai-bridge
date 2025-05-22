
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newTask: {
    title: string;
    description: string;
    dueDate: string;
  };
  onTaskChange: (task: { title: string; description: string; dueDate: string }) => void;
  onAddTask: () => void;
}

export function AddTaskDialog({
  open,
  onOpenChange,
  newTask,
  onTaskChange,
  onAddTask
}: AddTaskDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Personal Task</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => onTaskChange({...newTask, title: e.target.value})}
              placeholder="Enter task title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => onTaskChange({...newTask, description: e.target.value})}
              placeholder="Enter task details (optional)"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={newTask.dueDate}
              onChange={(e) => onTaskChange({...newTask, dueDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onAddTask} disabled={!newTask.title}>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
