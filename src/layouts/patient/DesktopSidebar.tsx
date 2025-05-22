
import React from 'react';
import { PatientSidebarContent } from './PatientSidebarContent';

type DesktopSidebarProps = {
  patientFullName: string;
};

export function DesktopSidebar({ patientFullName }: DesktopSidebarProps) {
  return (
    <aside className="hidden md:flex w-64 flex-col bg-background border-r fixed h-screen">
      <PatientSidebarContent patientFullName={patientFullName} />
    </aside>
  );
}
