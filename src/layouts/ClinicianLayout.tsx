
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './clinician/MobileTopNav';
import { DesktopSidebar } from './clinician/DesktopSidebar';
import { useClinicianProfile } from './clinician/useClinicianProfile';
import { useIsMobile } from '@/hooks/use-mobile';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  console.log('🏗️ ClinicianLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { clinicianFullName } = useClinicianProfile();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Nav */}
      {isMobile && (
        <MobileTopNav 
          isOpen={isOpen} 
          setIsOpen={setIsOpen}
        />
      )}
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopSidebar />
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pt-16' : 'md:ml-64'} bg-gray-50 min-h-screen`}>
        <div className={`w-full min-h-screen ${isMobile ? 'px-4 py-6' : 'p-6'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
