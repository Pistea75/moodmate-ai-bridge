
import React from 'react';
import { PatientSidebarContent } from './PatientSidebarContent';

type DesktopSidebarProps = {
  patientFullName: React.ReactNode;
  onCollapse?: () => void;
};

export function DesktopSidebar({ patientFullName, onCollapse }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 bg-background border-r border-border z-20">
      <PatientSidebarContent patientFullName={patientFullName} onCollapse={onCollapse} />
    </aside>
  );
}
