
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  UserPlus, 
  MessageSquare, 
  FileText, 
  Bell, 
  Settings,
  Plus,
  Download
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onScheduleSession: () => void;
  onAddTask: () => void;
}

export function QuickActions({ onScheduleSession, onAddTask }: QuickActionsProps) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Calendar,
      label: "Schedule Session",
      description: "Book a new therapy session",
      onClick: onScheduleSession,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      icon: Plus,
      label: "Add Task",
      description: "Create a new task for patients",
      onClick: onAddTask,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      icon: UserPlus,
      label: "View Patients",
      description: "Manage patient profiles",
      onClick: () => navigate("/clinician/patients"),
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      icon: FileText,
      label: "Generate Report",
      description: "Create patient reports",
      onClick: () => navigate("/clinician/reports"),
      color: "bg-orange-500 hover:bg-orange-600",
    },
    {
      icon: MessageSquare,
      label: "AI Training",
      description: "Customize AI responses",
      onClick: () => navigate("/clinician/train-ai"),
      color: "bg-pink-500 hover:bg-pink-600",
    },
    {
      icon: Download,
      label: "Export Data",
      description: "Download patient data",
      onClick: () => {
        // Mock export functionality
        const element = document.createElement("a");
        const file = new Blob(['Patient Data Export - ' + new Date().toLocaleDateString()], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "patient-data-export.txt";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      color: "bg-teal-500 hover:bg-teal-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all ${action.color} hover:text-white border-0`}
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-left">
                <div className="font-medium text-sm">{action.label}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
