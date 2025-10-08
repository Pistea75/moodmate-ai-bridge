
import React from 'react';
import { SuperAdminSidebarContent } from './SuperAdminSidebarContent';

interface SuperAdminDesktopSidebarProps {
  collapsed?: boolean;
}

export function SuperAdminDesktopSidebar({ collapsed = false }: SuperAdminDesktopSidebarProps) {
  return (
    <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 z-20 border-r border-gray-800 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-hidden ${
      collapsed ? 'md:w-16' : 'md:w-64'
    }`}>
      <SuperAdminSidebarContent collapsed={collapsed} />
    </aside>
  );
}
