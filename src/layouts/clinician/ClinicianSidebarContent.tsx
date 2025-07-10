
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  LogOut,
  BarChart3,
  AlertTriangle,
  Brain,
  CheckSquare,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useClinicianProfile } from './useClinicianProfile';

const navItems = [
  { 
    to: '/clinician/dashboard', 
    icon: Home, 
    label: 'Dashboard' 
  },
  { 
    to: '/clinician/patients', 
    icon: Users, 
    label: 'Patients' 
  },
  { 
    to: '/clinician/sessions', 
    icon: Calendar, 
    label: 'Sessions' 
  },
  { 
    to: '/clinician/tasks', 
    icon: CheckSquare, 
    label: 'Tasks' 
  },
  { 
    to: '/clinician/analytics', 
    icon: BarChart3, 
    label: 'Analytics' 
  },
  { 
    to: '/clinician/risk-management', 
    icon: AlertTriangle, 
    label: 'Risk Management' 
  },
  { 
    to: '/clinician/reports', 
    icon: FileText, 
    label: 'Reports' 
  },
  { 
    to: '/clinician/train-ai', 
    icon: Brain, 
    label: 'Train AI' 
  },
];

export function ClinicianSidebarContent() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { clinicianFullName } = useClinicianProfile();

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
            <p className="text-sm text-muted-foreground">Clinician Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
            <span className="text-sm font-medium text-muted-foreground">
              {clinicianFullName?.split(' ').map(n => n[0]).join('') || 'Dr'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {clinicianFullName || 'Doctor'}
            </p>
            <p className="text-xs text-muted-foreground">Clinician</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <NavLink
          to="/clinician/profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors w-full ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <User className="h-4 w-4" />
          Profile
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
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
