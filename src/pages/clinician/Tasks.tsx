
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

export default function Tasks() {
  const tasks = [
    {
      id: 1,
      title: "Review Sarah's weekly mood chart",
      patient: "Sarah Johnson",
      dueDate: "2025-04-25",
      completed: false,
    },
    {
      id: 2,
      title: "Prepare session notes for Michael",
      patient: "Michael Chen",
      dueDate: "2025-04-24",
      completed: true,
    },
    // Add more tasks as needed
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="w-[250px] pl-9"
            />
          </div>
          <Button className="bg-mood-purple hover:bg-mood-purple/90">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex items-center gap-4">
              <Checkbox 
                checked={task.completed}
                className="h-5 w-5"
              />
              <div className="flex-1">
                <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Patient: {task.patient}</span>
                  <span>•</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
