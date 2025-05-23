
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './patient/MobileTopNav';
import { DesktopSidebar } from './patient/DesktopSidebar';
import { usePatientProfile } from './patient/usePatientProfile';
import { useAuth } from '@/contexts/AuthContext';
import { PatientMoodBadge } from '@/components/clinician/PatientMoodBadge';

type PatientLayoutProps = {
  children: ReactNode;
};

export default function PatientLayout({ children }: PatientLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { patientFullName } = usePatientProfile();
  const { user } = useAuth();
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Top Nav */}
      <MobileTopNav 
        patientFullName={<span>{patientFullName}</span>} 
        isOpen={isOpen} 
        setIsOpen={setIsOpen}
      />
      
      {/* Sidebar for Desktop */}
      <DesktopSidebar 
        patientFullName={<span>{patientFullName}</span>} 
      />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 md:ml-64">
        <div className="container mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
