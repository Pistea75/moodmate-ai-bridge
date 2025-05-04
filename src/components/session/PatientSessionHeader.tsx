
import { Button } from "@/components/ui/button";
import { SessionCalendar } from "@/components/SessionCalendar";

interface PatientSessionHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  onScheduleClick: () => void;
  getSessionsForDate: (date: Date) => any[];
  isCheckingConnection: boolean;
}

export function PatientSessionHeader({
  date,
  onDateChange,
  onScheduleClick,
  getSessionsForDate,
  isCheckingConnection
}: PatientSessionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">My Sessions</h1>
        <p className="text-muted-foreground">Manage your therapy sessions</p>
      </div>

      <div className="flex items-center gap-2">
        <SessionCalendar 
          selectedDate={date}
          onDateChange={onDateChange}
          getSessionsForDate={getSessionsForDate}
        />

        <Button 
          className="bg-mood-purple hover:bg-mood-purple/90"
          onClick={onScheduleClick}
          disabled={isCheckingConnection}
        >
          Schedule Session
        </Button>
      </div>
    </div>
  );
}
