
import React from 'react';
import { ClinicianSidebarContent } from './ClinicianSidebarContent';

interface DesktopSidebarProps {
  collapsed?: boolean;
}

export function DesktopSidebar({ collapsed = false }: DesktopSidebarProps) {
  return (
    <aside className={`hidden md:flex md:flex-col md:fixed md:inset-y-0 bg-background border-r border-border z-20 transition-all duration-300 ${
      collapsed ? 'md:w-16' : 'md:w-64'
    }`}>
      <ClinicianSidebarContent collapsed={collapsed} />
    </aside>
  );
}
