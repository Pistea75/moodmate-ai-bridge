
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PatientNavItems } from './PatientNavItems';
import { LogOut, User } from 'lucide-react';
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
    <div className="flex flex-col h-full bg-background">
      {/* Logo and Title */}
      <div className="p-6 border-b border-border flex-shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-sm">
            <span className="font-bold text-primary-foreground text-xl">M</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">MoodMate</h1>
            <p className="text-sm text-muted-foreground">{t('patientPortal')}</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border flex-shrink-0 bg-background">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">
              {getDisplayName().split(' ').map(n => n[0]).join('') || 'P'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground truncate">
              {getDisplayName()}
            </p>
            <p className="text-sm text-muted-foreground">Patient</p>
          </div>
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
          to="/patient/profile"
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
