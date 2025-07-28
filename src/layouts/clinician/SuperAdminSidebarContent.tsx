
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function SuperAdminSidebarContent() {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const superAdminNavItems = [
    { title: 'System Overview', href: '/admin/super-admin-dashboard', icon: BarChart3 },
    { title: 'User Management', href: '/admin/user-management', icon: Users },
    { title: 'PHI Access Panel', href: '/admin/super-admin-panel', icon: Shield },
    { title: 'System Settings', href: '/admin/system-settings', icon: Settings },
    { title: 'Database Management', href: '/admin/database', icon: Database },
    { title: 'Security Logs', href: '/admin/security-logs', icon: Eye },
    { title: 'System Health', href: '/admin/system-health', icon: Server },
    { title: 'Audit Trail', href: '/admin/audit-trail', icon: FileText },
    { title: 'Risk Management', href: '/admin/risk-management', icon: AlertTriangle },
    { title: 'System Maintenance', href: '/admin/maintenance', icon: Lock },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      {/* Logo and Title */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">MoodMate</h1>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">SUPER ADMIN</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Super Admin Warning */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2 text-blue-800 dark:text-blue-400">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-medium">ELEVATED PRIVILEGES ACTIVE</span>
        </div>
      </div>

      {/* Scrollable Navigation Area */}
      <ScrollArea className="flex-1">
        <nav className="p-4 space-y-1">
          {superAdminNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95",
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
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
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-1 flex-shrink-0">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-700'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700'
            )
          }
        >
          <User className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">Admin Profile</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 w-full justify-start text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 active:scale-95"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          <span className="flex-1">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
