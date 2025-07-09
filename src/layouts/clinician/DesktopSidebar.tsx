
import React from 'react';
import { ClinicianSidebarContent } from './ClinicianSidebarContent';

export function DesktopSidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r border-border z-20">
      <ClinicianSidebarContent />
    </aside>
  );
}
