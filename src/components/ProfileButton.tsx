import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileButtonProps {
  onClick: () => void;
  patientName: string;
}

export function ProfileButton({ onClick, patientName }: ProfileButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
    >
      <User className="h-4 w-4 text-blue-600" />
      <span className="text-blue-600">View Profile</span>
    </Button>
  );
}