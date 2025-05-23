
import React from 'react';
import { PatientNavItems } from './PatientNavItems';

type PatientSidebarContentProps = {
  patientName: React.ReactNode;
};

export function PatientSidebarContent({ patientName }: PatientSidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-6 border-b">
        <h2 className="font-semibold text-lg">{patientName}</h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <PatientNavItems />
      </div>
    </div>
  );
}
