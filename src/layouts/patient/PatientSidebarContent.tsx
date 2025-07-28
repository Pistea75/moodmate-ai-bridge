
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MoodMate</h1>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">{t('patientPortal')}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              {getDisplayName().split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">
              {getDisplayName()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Patient</p>
          </div>
        </div>
      </div>

      {/* Wellness Status Badge */}
      <div className="p-4 bg-purple-50 dark:bg-purple-950/30 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
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
                    ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-1 flex-shrink-0">
        <NavLink
          to="/patient/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700'
            )
          }
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('profile')}</span>
        </NavLink>
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-gray-200 dark:active:bg-gray-700 active:scale-95"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('logout')}</span>
        </Button>
      </div>
    </div>
  );
}
