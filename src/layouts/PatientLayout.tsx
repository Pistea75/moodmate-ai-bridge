
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './patient/MobileTopNav';
import { DesktopSidebar } from './patient/DesktopSidebar';
import { usePatientProfile } from './patient/usePatientProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft } from 'lucide-react';

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  console.log('PatientLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
      {!isMobile && !isSidebarCollapsed && (
        <DesktopSidebar 
          patientFullName={<span className="text-foreground">{patientFullName}</span>}
          onCollapse={() => setIsSidebarCollapsed(true)}
        />
      )}
      
      {/* Collapsed Sidebar Button */}
      {!isMobile && isSidebarCollapsed && (
        <button
          onClick={() => setIsSidebarCollapsed(false)}
          className="fixed left-4 top-4 z-30 p-2 bg-background border border-border rounded-md shadow-md hover:bg-muted transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronLeft className="h-5 w-5 rotate-180 text-foreground" />
        </button>
      )}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pt-16' : isSidebarCollapsed ? '' : 'md:ml-64'} bg-gray-50 min-h-screen`}>
        <div className={`w-full min-h-screen ${isMobile ? 'px-3 py-4' : 'p-4'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
