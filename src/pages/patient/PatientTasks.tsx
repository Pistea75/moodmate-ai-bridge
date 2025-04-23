
import PatientLayout from '../../layouts/PatientLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";

export default function PatientTasks() {
  const tasks = [
    {
      id: 1,
      title: "Daily Mood Journal",
      description: "Write about your feelings and experiences today",
      dueDate: "2025-04-24",
      completed: false,
      assignedBy: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      title: "Mindfulness Exercise",
      description: "Complete 10-minute breathing meditation",
      dueDate: "2025-04-24",
      completed: true,
      assignedBy: "Dr. Sarah Johnson"
    }
  ];

  return (
    <PatientLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            View Calendar
          </Button>
        </div>

        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox checked={task.completed} className="mt-1" />
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due: {task.dueDate}
                    </span>
                    <span>•</span>
                    <span>Assigned by: {task.assignedBy}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
}
