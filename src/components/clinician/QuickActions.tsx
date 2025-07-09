
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Plus, 
  Users, 
  FileText, 
  MessageSquare,
  Bell
} from "lucide-react";
import { useNotificationService } from "@/hooks/useNotificationService";

interface QuickActionsProps {
  onScheduleSession?: () => void;
  onAddTask?: () => void;
}

export function QuickActions({ onScheduleSession, onAddTask }: QuickActionsProps) {
  const { createTestNotifications } = useNotificationService();

  const handleScheduleSession = () => {
    console.log('Schedule session clicked');
    onScheduleSession?.();
  };

  const handleAddTask = () => {
    console.log('Add task clicked');
    onAddTask?.();
  };

  const handleViewPatients = () => {
    console.log('View patients clicked');
    window.location.href = '/clinician/patients';
  };

  const handleCreateReport = () => {
    console.log('Create report clicked');
    window.location.href = '/clinician/reports';
  };

  const handleAIChat = () => {
    console.log('AI Chat clicked');
    // Navigate to AI chat or open modal
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={handleScheduleSession}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Schedule Session</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={handleAddTask}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs">Add Task</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={handleViewPatients}
          >
            <Users className="h-5 w-5" />
            <span className="text-xs">View Patients</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={handleCreateReport}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">Create Report</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={handleAIChat}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">AI Chat</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={createTestNotifications}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs">Test Notifications</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
