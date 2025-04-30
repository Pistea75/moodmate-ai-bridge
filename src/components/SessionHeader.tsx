
import { SessionActionButton } from "./session/SessionActionButton";

interface SessionHeaderProps {
  onScheduleSession: () => void;
}

export function SessionHeader({ onScheduleSession }: SessionHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Sessions</h1>
        <p className="text-muted-foreground">Manage your therapy sessions</p>
      </div>
      <SessionActionButton onClick={onScheduleSession} />
    </div>
  );
}
