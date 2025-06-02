
import { Button } from "@/components/ui/button";

interface SessionListEmptyProps {
  onScheduleClick: () => void;
}

export function SessionListEmpty({ onScheduleClick }: SessionListEmptyProps) {
  return (
    <div className="text-center py-12">
      <p className="text-muted-foreground">No sessions scheduled for this date.</p>
      <Button 
        className="mt-4 bg-mood-purple hover:bg-mood-purple/90" 
        onClick={onScheduleClick}
      >
        Schedule Session
      </Button>
    </div>
  );
}
