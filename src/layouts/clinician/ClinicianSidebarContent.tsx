
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  BarChart3, 
  CheckSquare, 
  FileText, 
  Settings, 
  LogOut, 
  User,
  Brain,
  BookOpen,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClinicianSidebarContent() {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const navItems = [
    { title: t('dashboard'), href: '/clinician/dashboard', icon: LayoutDashboard },
    { title: t('patients'), href: '/clinician/patients', icon: Users },
    { title: t('sessions'), href: '/clinician/sessions', icon: Calendar },
    { title: t('communications'), href: '/clinician/communications', icon: MessageSquare },
    { title: t('analytics'), href: '/clinician/analytics', icon: BarChart3 },
    { title: t('tasks'), href: '/clinician/tasks', icon: CheckSquare },
    { title: t('reports'), href: '/clinician/reports', icon: FileText },
    { title: t('resourceLibrary'), href: '/clinician/resource-library', icon: BookOpen },
    { title: t('reminders'), href: '/clinician/reminders', icon: Bell },
    { title: t('trainAI'), href: '/clinician/train-ai', icon: Brain },
  ];

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
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MoodMate</h1>
              <p className="text-sm text-blue-400 font-medium">{t('clinicianPortal')}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Professional Status Badge */}
      <div className="p-4 bg-blue-950/50 dark:bg-blue-900/20 border-b border-gray-800 dark:border-gray-700">
        <div className="flex items-center gap-2 text-blue-400">
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">CLINICAL PORTAL</span>
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
                    ? 'bg-blue-900/50 text-blue-300 border border-blue-800'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
                )
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-700 space-y-1 flex-shrink-0">
        <NavLink
          to="/clinician/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-blue-900/50 text-blue-300 border border-blue-800'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('profile')}</span>
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-blue-900/50 text-blue-300 border border-blue-800'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('settings')}</span>
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
