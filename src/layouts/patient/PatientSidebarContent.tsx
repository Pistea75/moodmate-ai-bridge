
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientNavItems } from './PatientNavItems';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, User, Brain, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientSidebarContentProps {
  patientFullName: React.ReactNode;
}

export function PatientSidebarContent({ patientFullName }: PatientSidebarContentProps) {
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const navItems = PatientNavItems();

  const getDisplayName = () => {
    if (typeof patientFullName === 'string') {
      return patientFullName;
    }
    if (React.isValidElement(patientFullName)) {
      const content = patientFullName.props?.children;
      return typeof content === 'string' ? content : t('patient');
    }
    return t('patient');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 dark:bg-gray-950 border-r border-gray-800 dark:border-gray-700">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-800 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-600 to-violet-600">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MoodMate</h1>
              <p className="text-sm text-indigo-400 font-medium">{t('patientPortal')}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-800 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-indigo-950/50 dark:bg-indigo-900/20">
          <div className="h-12 w-12 rounded-full bg-indigo-700/50 dark:bg-indigo-600/40 flex items-center justify-center">
            <span className="text-sm font-semibold text-indigo-300">
              {getDisplayName().split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white truncate">
              {getDisplayName()}
            </p>
            <p className="text-sm text-indigo-400">Patient</p>
          </div>
        </div>
      </div>

      {/* Wellness Status Badge */}
      <div className="p-4 bg-indigo-950/50 dark:bg-indigo-900/20 border-b border-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 text-indigo-400">
          <Heart className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">WELLNESS PORTAL</span>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95",
                  isActive
                    ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
                )
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{t(item.title as keyof typeof t)}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-700 space-y-1 flex-shrink-0">
        <NavLink
          to="/patient/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-indigo-900/50 text-indigo-300 border border-indigo-800'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('profile')}</span>
        </NavLink>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700 active:scale-95"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('logout')}</span>
        </Button>
      </div>
    </div>
  );
}
