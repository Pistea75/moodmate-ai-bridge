
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
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
import { useLanguage } from '@/contexts/LanguageContext';
import { useClinicianProfile } from './useClinicianProfile';

export function ClinicianSidebarContent() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { clinicianFullName } = useClinicianProfile();
  const { t } = useLanguage();

  const navItems = [
    { 
      to: '/clinician/dashboard', 
      icon: Home, 
      label: t('dashboard')
    },
    { 
      to: '/clinician/patients', 
      icon: Users, 
      label: t('patients')
    },
    { 
      to: '/clinician/sessions', 
      icon: Calendar, 
      label: t('sessions')
    },
    { 
      to: '/clinician/tasks', 
      icon: CheckSquare, 
      label: t('tasks')
    },
    { 
      to: '/clinician/analytics', 
      icon: BarChart3, 
      label: t('analytics')
    },
    { 
      to: '/clinician/risk-management', 
      icon: AlertTriangle, 
      label: 'Risk Management'
    },
    { 
      to: '/clinician/reports', 
      icon: FileText, 
      label: t('reports')
    },
    { 
      to: '/clinician/train-ai', 
      icon: Brain, 
      label: 'Train AI'
    },
  ];

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
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-xl">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MoodMate</h1>
            <p className="text-sm text-muted-foreground">Clinician Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
            <span className="text-sm font-semibold text-muted-foreground">
              {clinicianFullName?.split(' ').map(n => n[0]).join('') || 'Dr'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground truncate">
              {clinicianFullName || 'Doctor'}
            </p>
            <p className="text-sm text-muted-foreground">Clinician</p>
          </div>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="p-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-6 border-t border-border space-y-1 flex-shrink-0">
        <NavLink
          to="/clinician/profile"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 w-full ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`
          }
        >
          <User className="h-5 w-5" />
          {t('profile')}
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 w-full ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`
          }
        >
          <Settings className="h-5 w-5" />
          {t('settings')}
        </NavLink>
      </div>
    </div>
  );
}
