
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { toast } from './ui/use-toast';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | null;
  className?: string;
}

export function LogoutButton({ variant = 'ghost', className = '' }: LogoutButtonProps) {
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  return (
    <Button 
      variant={variant} 
      className={`text-destructive ${className}`}
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4 mr-2" />
      <span>Log out</span>
    </Button>
  );
}
