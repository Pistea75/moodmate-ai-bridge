
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './clinician/MobileTopNav';
import { DesktopSidebar } from './clinician/DesktopSidebar';
import { useClinicianProfile } from './clinician/useClinicianProfile';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  console.log('ClinicianLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { clinicianFullName } = useClinicianProfile();
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Top Nav */}
      <MobileTopNav 
        clinicianName={<span className="text-foreground">{clinicianFullName}</span>} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
      />
      
      {/* Sidebar for Desktop */}
      <DesktopSidebar />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64 bg-background">
        <div className="container mx-auto px-4 py-6 bg-background min-h-screen">
          <div className="text-foreground">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
