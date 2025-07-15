
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './patient/MobileTopNav';
import { DesktopSidebar } from './patient/DesktopSidebar';
import { usePatientProfile } from './patient/usePatientProfile';

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  console.log('PatientLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const { patientFullName } = usePatientProfile();
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Top Nav */}
      <MobileTopNav 
        patientFullName={<span className="text-foreground">{patientFullName}</span>} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
      />
      
      {/* Sidebar for Desktop */}
      <DesktopSidebar 
        patientFullName={<span className="text-foreground">{patientFullName}</span>} 
      />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64 bg-gray-50 min-h-screen">
        <div className="w-full min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
