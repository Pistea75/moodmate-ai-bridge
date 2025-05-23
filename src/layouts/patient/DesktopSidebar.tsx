
import React from 'react';
import { PatientSidebarContent } from './PatientSidebarContent';

type DesktopSidebarProps = {
  patientFullName: React.ReactNode;
};

export function DesktopSidebar({ patientFullName }: DesktopSidebarProps) {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="border-r bg-background flex flex-col h-full">
        <PatientSidebarContent patientName={patientFullName} />
      </div>
    </div>
  );
}
