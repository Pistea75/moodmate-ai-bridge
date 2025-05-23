
import React from 'react';
import { PatientNavItems } from './PatientNavItems';

type PatientSidebarContentProps = {
  patientName: React.ReactNode;
};

export function PatientSidebarContent({ patientName }: PatientSidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-6">
        <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white">
          M
        </div>
        <h3 className="text-xl font-bold">MoodMate</h3>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <PatientNavItems />
      </div>
    </div>
  );
}
