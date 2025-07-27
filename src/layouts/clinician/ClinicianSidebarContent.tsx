
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
import { cn } from '@/lib/utils';

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
      label: t('riskManagement')
    },
    { 
      to: '/clinician/reports', 
      icon: FileText, 
      label: t('reports')
    },
    { 
      to: '/clinician/train-ai', 
      icon: Brain, 
      label: t('trainAI')
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
    <div className="flex flex-col h-full bg-white">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="font-bold text-primary-foreground text-xl">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MoodMate</h1>
            <p className="text-sm text-muted-foreground">{t('clinicianPortal')}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0 bg-white">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
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
      <ScrollArea className="flex-1 bg-white">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 active:scale-95",
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 active:bg-gray-100'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-1 flex-shrink-0 bg-white">
        <NavLink
          to="/clinician/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 active:bg-gray-100'
            )
          }
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{t('profile')}</span>
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-gray-50 active:bg-gray-100'
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{t('settings')}</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full justify-start text-muted-foreground hover:text-foreground hover:bg-gray-50 active:bg-gray-100 active:scale-95"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{t('logout')}</span>
        </Button>
      </div>
    </div>
  );
}
