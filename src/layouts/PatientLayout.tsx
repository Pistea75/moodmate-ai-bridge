
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './patient/MobileTopNav';
import { DesktopSidebar } from './patient/DesktopSidebar';
import { usePatientProfile } from './patient/usePatientProfile';
import { useIsMobile } from '@/hooks/use-mobile';

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  console.log('PatientLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { patientFullName } = usePatientProfile();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Nav */}
      {isMobile && (
        <MobileTopNav 
          patientFullName={<span className="text-foreground">{patientFullName}</span>} 
          isOpen={isOpen} 
          setIsOpen={setIsOpen}
        />
      )}
      
      {/* Desktop Sidebar */}
      {!isMobile && (
        <DesktopSidebar 
          patientFullName={<span className="text-foreground">{patientFullName}</span>} 
        />
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
