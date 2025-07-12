
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { patientNavItems } from './PatientNavItems';
import { useAuth } from '@/contexts/AuthContext';
import { usePatientProfile } from './usePatientProfile';
import { LogOut, Settings } from 'lucide-react';

type PatientSidebarContentProps = {
  patientName: React.ReactNode;
};

export function PatientSidebarContent({ patientName }: PatientSidebarContentProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { patientFullName } = usePatientProfile();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Logo and Title */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-lg">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MoodMate</h1>
            <p className="text-sm text-muted-foreground">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {patientFullName?.split(' ').map(n => n[0]).join('') || patientName?.toString().split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {patientFullName || patientName || 'Patient'}
            </p>
            <p className="text-xs text-muted-foreground">Patient</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {patientNavItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/patient/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
