
import React from 'react';
import { Link } from 'react-router-dom';
import { PatientNavItems } from './PatientNavItems';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { LogoutButton } from '@/components/LogoutButton';

type PatientSidebarContentProps = {
  patientName: React.ReactNode;
};

export function PatientSidebarContent({ patientName }: PatientSidebarContentProps) {
  const { user } = useAuth();
  
  // Get first letter of name for avatar fallback
  const getInitial = () => {
    const name = user?.user_metadata?.first_name || '';
    return name.charAt(0).toUpperCase() || 'P';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
          M
        </div>
        <h3 className="text-xl font-bold">MoodMate</h3>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <PatientNavItems />
      </div>
      
      {/* Profile section at bottom */}
      <div className="mt-auto border-t pt-4 px-3 pb-4">
        <Link to="/patient/profile" className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{getInitial()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{patientName}</span>
            <span className="text-xs text-muted-foreground">Patient</span>
          </div>
        </Link>
        <div className="mt-2">
          <LogoutButton className="w-full justify-start text-sm" />
        </div>
      </div>
    </div>
  );
}
