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
  AlertTriangle,
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
    { title: t('riskManagement'), href: '/clinician/risk-management', icon: AlertTriangle },
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
    <div className="flex flex-col h-full bg-background">
      {/* Logo and Title */}
      <div className="p-6 border-b border-border flex-shrink-0 bg-background">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">MoodMate</h1>
              <p className="text-sm text-muted-foreground">{t('clinicianPortal')}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1 bg-background">
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 active:scale-95",
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/80'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{t(item.title as keyof typeof t)}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-1 flex-shrink-0 bg-background">
        <NavLink
          to="/clinician/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/80'
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
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/80'
            )
          }
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{t('settings')}</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 active:bg-muted/80 active:scale-95"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">{t('logout')}</span>
        </Button>
      </div>
    </div>
  );
}
