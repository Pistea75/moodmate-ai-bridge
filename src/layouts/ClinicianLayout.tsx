
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './clinician/MobileTopNav';
import { DesktopSidebar } from './clinician/DesktopSidebar';
import { SuperAdminDesktopSidebar } from './clinician/SuperAdminDesktopSidebar';
import { useClinicianProfile } from './clinician/useClinicianProfile';
import { useIsMobile } from '@/hooks/use-mobile';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  console.log('🏗️ ClinicianLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { clinicianFullName, isSuperAdmin } = useClinicianProfile();
  const isMobile = useIsMobile();
  
  return (
    <div className={`flex min-h-screen ${isSuperAdmin ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'}`}>
      {/* Mobile Top Nav */}
      {isMobile && (
        <MobileTopNav 
          isOpen={isOpen} 
          setIsOpen={setIsOpen}
        />
      )}
      
      {/* Desktop Sidebar - Show different sidebar based on super admin status */}
      {!isMobile && (
        isSuperAdmin ? (
          <SuperAdminDesktopSidebar />
        ) : (
          <DesktopSidebar />
        )
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pt-16' : 'md:ml-64'} ${isSuperAdmin ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} min-h-screen`}>
        <div className={`w-full min-h-screen ${isMobile ? 'px-3 py-4' : 'p-4'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
