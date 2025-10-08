
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Settings, 
  LogOut, 
  User,
  Brain,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClinicianSidebarContentProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function ClinicianSidebarContent({ collapsed = false, onToggle }: ClinicianSidebarContentProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full border-r border-gray-800 dark:border-gray-700" style={{
      backgroundColor: `hsl(var(--sidebar-background))`,
    }}>
      {/* Header with Toggle Button */}
      <div className="p-4 border-b border-gray-800 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between gap-2">
          {/* Toggle Button - Always visible */}
          <button
            onClick={onToggle}
            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors group"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <PanelLeft className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
            ) : (
              <PanelLeftClose className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" />
            )}
          </button>

          {/* Logo and Title - Hidden when collapsed */}
          <div className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
            collapsed ? 'w-0 opacity-0' : 'flex-1 opacity-100'
          }`}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{
              background: `linear-gradient(135deg, hsl(var(--sidebar-primary)), hsl(var(--sidebar-accent)))`,
            }}>
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">MoodMate</h1>
              <p className="text-xs font-medium whitespace-nowrap" style={{ color: `hsl(var(--sidebar-primary))` }}>
                {t('auth.clinicianAccount', 'Clinician Portal')}
              </p>
            </div>
          </div>

          {/* Theme Toggle - Hidden when collapsed */}
          <div className={`transition-all duration-300 flex-shrink-0 ${
            collapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
          }`}>
            <ThemeToggle />
          </div>
        </div>
      </div>


      {/* Scrollable Navigation Area - Hidden */}
      <ScrollArea className="flex-1">
        {/* Navigation items hidden as requested */}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-700 space-y-1 flex-shrink-0">
        <NavLink
          to="/clinician/profile"
          title={collapsed ? t('nav.profile') : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full hover:scale-[1.02] active:scale-95 group overflow-hidden",
              collapsed ? 'justify-center' : '',
              isActive
                ? 'text-white border shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? `hsl(var(--sidebar-accent))` : undefined,
            borderColor: isActive ? `hsl(var(--sidebar-primary))` : undefined,
            color: isActive ? `hsl(var(--sidebar-primary))` : undefined,
          })}
        >
          <User className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {t('nav.profile')}
          </span>
        </NavLink>
        
        <NavLink
          to="/clinician/settings"
          title={collapsed ? t('nav.settings') : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full hover:scale-[1.02] active:scale-95 group overflow-hidden",
              collapsed ? 'justify-center' : '',
              isActive
                ? 'text-white border shadow-sm'
                : 'text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700'
            )
          }
          style={({ isActive }) => ({
            backgroundColor: isActive ? `hsl(var(--sidebar-accent))` : undefined,
            borderColor: isActive ? `hsl(var(--sidebar-primary))` : undefined,
            color: isActive ? `hsl(var(--sidebar-primary))` : undefined,
          })}
        >
          <Settings className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {t('nav.settings')}
          </span>
        </NavLink>

        <Button
          variant="ghost"
          title={collapsed ? t('nav.logout') : undefined}
          onClick={() => setShowLogoutDialog(true)}
          className={cn(
            "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full text-gray-300 hover:text-white hover:bg-gray-800 dark:hover:bg-gray-700 active:bg-gray-700 hover:scale-[1.02] active:scale-95 group overflow-hidden",
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {t('nav.logout')}
          </span>
        </Button>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log Out</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to log out. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
