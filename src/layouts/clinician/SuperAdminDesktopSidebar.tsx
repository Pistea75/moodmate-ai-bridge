
import React from 'react';
import { SuperAdminSidebarContent } from './SuperAdminSidebarContent';

export function SuperAdminDesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20 border-r border-red-200 dark:border-red-800">
      <SuperAdminSidebarContent />
    </aside>
  );
}
