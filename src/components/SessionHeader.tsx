
import { SessionActionButton } from "./session/SessionActionButton";
import { SessionCalendar } from "@/components/SessionCalendar";

interface SessionHeaderProps {
  onScheduleSession: () => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  getSessionsForDate: (date: Date) => any[];
}

export function SessionHeader({ 
  onScheduleSession, 
  selectedDate, 
  onDateChange,
  getSessionsForDate 
}: SessionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-muted-foreground">Manage your therapy sessions</p>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <SessionCalendar 
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          getSessionsForDate={getSessionsForDate}
        />
        <SessionActionButton onClick={onScheduleSession} />
      </div>
    </div>
  );
}
