
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
  Bell,
  Store
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClinicianSidebarContent() {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const navItems = [
    { title: t('nav.dashboard'), href: '/clinician/dashboard', icon: LayoutDashboard },
    { title: t('nav.patients'), href: '/clinician/patients', icon: Users },
    { title: t('nav.sessions'), href: '/clinician/sessions', icon: Calendar },
    { title: t('nav.messages'), href: '/clinician/communications', icon: MessageSquare },
    { title: t('nav.marketplace'), href: '/clinician/marketplace-profile', icon: Store },
    
    { title: t('nav.tasks'), href: '/clinician/tasks', icon: CheckSquare },
    { title: t('nav.reports'), href: '/clinician/reports', icon: FileText },
    { title: t('nav.resources', 'Resource Library'), href: '/clinician/resource-library', icon: BookOpen },
    { title: t('nav.notifications', 'Reminders'), href: '/clinician/reminders', icon: Bell },
    { title: t('nav.trainAI'), href: '/clinician/train-ai', icon: Brain },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-800 dark:border-gray-700" style={{
      backgroundColor: `hsl(var(--sidebar-background))`,
    }}>
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-800 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg" style={{
              background: `linear-gradient(135deg, hsl(var(--sidebar-primary)), hsl(var(--sidebar-accent)))`,
            }}>
              <Brain className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">MoodMate</h1>
              <p className="text-sm font-medium" style={{ color: `hsl(var(--sidebar-primary))` }}>{t('auth.clinicianAccount', 'Clinician Portal')}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Professional Status Badge */}
      <div className="p-4 border-b border-gray-800 dark:border-gray-700" style={{
        backgroundColor: `hsl(var(--sidebar-accent))`,
      }}>
        <div className="flex items-center gap-2" style={{ color: `hsl(var(--sidebar-primary))` }}>
          <Users className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wide">{t('clinician.portal', 'CLINICAL PORTAL')}</span>
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
                    ? 'text-white border'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
                )
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? `hsl(var(--sidebar-accent))` : undefined,
                borderColor: isActive ? `hsl(var(--sidebar-primary))` : undefined,
                color: isActive ? `hsl(var(--sidebar-primary))` : undefined,
              })}
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
                ? 'text-white border'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? `hsl(var(--sidebar-accent))` : undefined,
            borderColor: isActive ? `hsl(var(--sidebar-primary))` : undefined,
            color: isActive ? `hsl(var(--sidebar-primary))` : undefined,
          })}
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('nav.profile')}</span>
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'text-white border'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? `hsl(var(--sidebar-accent))` : undefined,
            borderColor: isActive ? `hsl(var(--sidebar-primary))` : undefined,
            color: isActive ? `hsl(var(--sidebar-primary))` : undefined,
          })}
        >
          <Settings className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('nav.settings')}</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700 active:scale-95"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">{t('nav.logout')}</span>
        </Button>
      </div>
    </div>
  );
}
