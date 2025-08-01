
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { PatientNavItems } from './PatientNavItems';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LogOut, User, Brain, Heart, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PatientSidebarContentProps {
  patientFullName: React.ReactNode;
}

export function PatientSidebarContent({ patientFullName }: PatientSidebarContentProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const navItems = PatientNavItems();

  const getDisplayName = () => {
    if (typeof patientFullName === 'string') {
      return patientFullName;
    }
    if (React.isValidElement(patientFullName)) {
      const content = patientFullName.props?.children;
      return typeof content === 'string' ? content : t('nav.profile');
    }
    return t('nav.profile');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Capitalize first letter of each word
  const capitalize = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
              <p className="text-sm font-medium" style={{ color: `hsl(var(--sidebar-primary))` }}>Patient Portal</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-gray-800 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 rounded-lg" style={{
          backgroundColor: `hsl(var(--sidebar-accent))`,
        }}>
          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{
            backgroundColor: `hsl(var(--sidebar-primary) / 0.5)`,
          }}>
            <span className="text-sm font-semibold" style={{ color: `hsl(var(--sidebar-primary))` }}>
              {getDisplayName().split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-white truncate">
              {getDisplayName()}
            </p>
            <p className="text-sm" style={{ color: `hsl(var(--sidebar-primary))` }}>{t('auth.patientAccount')}</p>
          </div>
        </div>
      </div>

      {/* Wellness Status Badge */}
      <div className="p-4 border-b border-gray-800 dark:border-gray-700" style={{
        backgroundColor: `hsl(var(--sidebar-accent))`,
      }}>
        <div className="flex items-center gap-2" style={{ color: `hsl(var(--sidebar-primary))` }}>
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
              <span className="flex-1">{capitalize(t(item.title))}</span>
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
          to="/patient/settings"
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
