
import { ReactNode, useState } from 'react';
import { MobileTopNav } from './clinician/MobileTopNav';
import { DesktopSidebar } from './clinician/DesktopSidebar';
import { SuperAdminDesktopSidebar } from './clinician/SuperAdminDesktopSidebar';
import { useClinicianProfile } from './clinician/useClinicianProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  console.log('🏗️ ClinicianLayout component rendering');
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
          <SuperAdminDesktopSidebar collapsed={sidebarCollapsed} />
        ) : (
          <DesktopSidebar collapsed={sidebarCollapsed} />
        )
      )}
      
      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${
        isMobile 
          ? 'pt-16' 
          : sidebarCollapsed 
            ? 'md:ml-16' 
            : 'md:ml-64'
      } ${isSuperAdmin ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-900'} min-h-screen`}>
        {/* Burger Menu Button for Desktop - Integrated with sidebar */}
        {!isMobile && (
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`fixed z-30 transition-all duration-300 ease-in-out group ${
              sidebarCollapsed ? 'left-4 top-4' : 'left-[240px] top-4'
            }`}
            style={{
              background: `linear-gradient(135deg, hsl(var(--sidebar-primary)), hsl(var(--sidebar-accent)))`,
            }}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95">
              <div className="flex flex-col gap-1.5 w-5">
                <span 
                  className={`h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                    sidebarCollapsed ? 'rotate-0 w-5' : 'rotate-45 translate-y-2 w-5'
                  }`}
                />
                <span 
                  className={`h-0.5 bg-white rounded-full transition-all duration-300 ${
                    sidebarCollapsed ? 'opacity-100 w-5' : 'opacity-0 w-0'
                  }`}
                />
                <span 
                  className={`h-0.5 bg-white rounded-full transition-all duration-300 origin-center ${
                    sidebarCollapsed ? 'rotate-0 w-5' : '-rotate-45 -translate-y-2 w-5'
                  }`}
                />
              </div>
            </div>
          </button>
        )}
        
        <div className={`w-full min-h-screen ${isMobile ? 'px-3 py-4' : 'p-4 pt-16'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
