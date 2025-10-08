
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  Activity, 
  FileText, 
  AlertTriangle, 
  LogOut, 
  User,
  Eye,
  Lock,
  Server,
  BarChart3,
  Clock,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuperAdminSidebarContentProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function SuperAdminSidebarContent({ collapsed = false, onToggle }: SuperAdminSidebarContentProps) {
  const { t } = useTranslation();
  const { signOut } = useAuth();

  const superAdminNavItems = [
    { title: t('admin.systemOverview', 'System Overview'), href: '/admin/super-admin-dashboard', icon: BarChart3 },
    { title: t('admin.userManagement', 'User Management'), href: '/admin/user-management', icon: Users },
    { title: 'Waiting List', href: '/admin/waiting-list', icon: Clock },
    { title: t('admin.phiAccess', 'PHI Access Panel'), href: '/admin/super-admin-panel', icon: Shield },
    { title: t('nav.settings'), href: '/admin/system-settings', icon: Settings },
    { title: t('admin.database', 'Database Management'), href: '/admin/database', icon: Database },
    { title: t('admin.securityLogs', 'Security Logs'), href: '/admin/security-logs', icon: Eye },
    { title: t('admin.systemHealth', 'System Health'), href: '/admin/system-health', icon: Server },
    { title: t('admin.auditTrail', 'Audit Trail'), href: '/admin/audit-trail', icon: FileText },
    { title: t('admin.systemMaintenance', 'System Maintenance'), href: '/admin/maintenance', icon: Lock },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 dark:bg-black border-r border-gray-800 dark:border-gray-800">
      {/* Header with Toggle Button */}
      <div className="p-4 border-b border-gray-800 dark:border-gray-800 flex-shrink-0">
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
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-white whitespace-nowrap">MoodMate</h1>
              <p className="text-xs text-blue-400 font-medium whitespace-nowrap">
                {t('admin.superAdmin', 'SUPER ADMIN')}
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

      {/* Super Admin Warning */}
      <div 
        className={`bg-blue-950 dark:bg-blue-950/50 border-b border-gray-800 dark:border-gray-800 transition-all duration-300 overflow-hidden ${
          collapsed ? 'h-0 p-0 opacity-0' : 'h-auto p-4 opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 text-blue-300 whitespace-nowrap">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs font-medium">
            {t('admin.elevatedPrivileges', 'ELEVATED PRIVILEGES ACTIVE')}
          </span>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {superAdminNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              title={collapsed ? item.title : undefined}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-[1.02] active:scale-95 group overflow-hidden",
                  collapsed ? 'justify-center' : '',
                  isActive
                    ? 'bg-blue-900 dark:bg-blue-900/50 text-blue-300 border border-blue-800 dark:border-blue-700 shadow-sm'
                    : 'text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800 active:bg-gray-700 dark:active:bg-gray-700'
                )
              }
            >
              <item.icon className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
                collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
              }`}>
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 dark:border-gray-800 space-y-1 flex-shrink-0">
        <NavLink
          to="/admin/profile"
          title={collapsed ? t('admin.adminProfile', 'Admin Profile') : undefined}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full hover:scale-[1.02] active:scale-95 group overflow-hidden",
              collapsed ? 'justify-center' : '',
              isActive
                ? 'bg-blue-900 dark:bg-blue-900/50 text-blue-300 border border-blue-800 dark:border-blue-700 shadow-sm'
                : 'text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800 active:bg-gray-700 dark:active:bg-gray-700'
            )
          }
        >
          <User className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {t('admin.adminProfile', 'Admin Profile')}
          </span>
        </NavLink>

        <Button
          variant="ghost"
          title={collapsed ? t('nav.logout', 'Sign Out') : undefined}
          onClick={handleSignOut}
          className={cn(
            "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full text-gray-300 dark:text-gray-400 hover:text-white dark:hover:text-white hover:bg-gray-800 dark:hover:bg-gray-800 active:bg-gray-700 dark:active:bg-gray-700 hover:scale-[1.02] active:scale-95 group overflow-hidden",
            collapsed ? 'justify-center' : 'justify-start'
          )}
        >
          <LogOut className="h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
          <span className={`flex-1 transition-all duration-300 whitespace-nowrap ${
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          }`}>
            {t('nav.logout', 'Sign Out')}
          </span>
        </Button>
      </div>
    </div>
  );
}
