
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './clinician/MobileTopNav';
import { DesktopSidebar } from './clinician/DesktopSidebar';
import { useClinicianProfile } from './clinician/useClinicianProfile';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  console.log('🏗️ ClinicianLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { clinicianFullName } = useClinicianProfile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Nav */}
      <MobileTopNav 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
      />
      
      {/* Sidebar for Desktop */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64 bg-gray-50 min-h-screen">
        <div className="w-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
