
import { Button } from "@/components/ui/button";

interface SessionActionButtonProps {
  onClick: () => void;
}

export function SessionActionButton({ onClick }: SessionActionButtonProps) {
  return (
    <Button 
      className="bg-mood-purple hover:bg-mood-purple/90"
      onClick={onClick}
    >
      Schedule Session
    </Button>
  );
}
