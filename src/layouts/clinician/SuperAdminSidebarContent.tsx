
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
  Brain,
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
    <div className="flex flex-col h-full bg-gradient-to-b from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
      {/* Logo and Title */}
      <div className="p-6 border-b border-red-200 dark:border-red-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg bg-gradient-to-br from-red-500 to-red-600">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-red-900 dark:text-red-100">MoodMate</h1>
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">SUPER ADMIN</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Super Admin Warning */}
      <div className="p-4 bg-red-100 dark:bg-red-900 border-b border-red-200 dark:border-red-800">
        <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
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
                  "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 active:scale-95",
                  isActive
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 hover:bg-red-200 dark:hover:bg-red-800/50 active:bg-red-300 dark:active:bg-red-700'
                )
              }
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span className="flex-1">{item.title}</span>
            </NavLink>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-red-200 dark:border-red-800 space-y-1 flex-shrink-0">
        <NavLink
          to="/admin/profile"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full active:scale-95",
              isActive
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 hover:bg-red-200 dark:hover:bg-red-800/50 active:bg-red-300 dark:active:bg-red-700'
            )
          }
        >
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">Admin Profile</span>
        </NavLink>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-4 text-base font-medium rounded-xl transition-all duration-200 w-full justify-start text-red-700 dark:text-red-300 hover:text-red-900 dark:hover:text-red-100 hover:bg-red-200 dark:hover:bg-red-800/50 active:bg-red-300 dark:active:bg-red-700 active:scale-95"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span className="flex-1">Sign Out</span>
        </Button>
      </div>
    </div>
  );
}
