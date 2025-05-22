
import React from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PatientNavItems } from './PatientNavItems';

type PatientSidebarContentProps = {
  patientFullName: string;
  setIsOpen?: (isOpen: boolean) => void;
  isMobile?: boolean;
};

export function PatientSidebarContent({ 
  patientFullName, 
  setIsOpen,
  isMobile = false 
}: PatientSidebarContentProps) {
  const handleNavItemClick = () => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  };

  if (isMobile) {
    return (
      <nav className="flex flex-col h-full bg-background">
        <div className="p-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback><User className="h-6 w-6" /></AvatarFallback>
          </Avatar>
          <div className="mt-2 font-medium">{patientFullName}</div>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <PatientNavItems isMobile={true} onItemClick={handleNavItemClick} />
        </div>
        <div className="border-t p-4">
          <Link 
            to="/patient/profile"
            className="flex items-center gap-2 text-sm text-foreground"
            onClick={handleNavItemClick}
          >
            <User size={18} />
            <span>View Profile</span>
          </Link>
        </div>
      </nav>
    );
  }
  
  return (
    <>
      <div className="p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-xl font-semibold text-primary">MoodMate</span>
        </Link>
      </div>
      <nav className="flex-1 px-2 py-4">
        <PatientNavItems />
      </nav>
      <div className="p-4 border-t">
        <Link 
          to="/patient/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent"
        >
          <div className="rounded-full bg-muted size-9 flex items-center justify-center">
            <User size={20} className="text-foreground" />
          </div>
          <div className="flex-1 text-sm">
            <div className="font-medium text-foreground">{patientFullName}</div>
            <div className="text-muted-foreground">View Profile</div>
          </div>
        </Link>
      </div>
    </>
  );
}
