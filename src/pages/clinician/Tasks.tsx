
import ClinicianLayout from '../../layouts/ClinicianLayout';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock } from "lucide-react";

export default function Tasks() {
  const tasks = [
    {
      id: 1,
      title: "Review Sarah's weekly progress report",
      description: "Complete weekly assessment and update treatment plan",
      dueDate: "2025-04-24",
      completed: false,
      patient: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Prepare session notes for Michael",
      description: "Document observations and update treatment goals",
      dueDate: "2025-04-24",
      completed: true,
      patient: "Michael Chen"
    }
  ];

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
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
                    <span>Patient: {task.patient}</span>
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
    </ClinicianLayout>
  );
}

