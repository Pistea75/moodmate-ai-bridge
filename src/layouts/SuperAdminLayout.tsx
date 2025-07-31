import { ReactNode } from 'react';
import { SuperAdminDesktopSidebar } from './clinician/SuperAdminDesktopSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSecureRoleValidation } from '@/hooks/useSecureRoleValidation';
import { useAuth } from '@/contexts/AuthContext';

type SuperAdminLayoutProps = {
  children: ReactNode;
};

export default function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const { user } = useAuth();
  const { isSuperAdmin } = useSecureRoleValidation(user);
  const isMobile = useIsMobile();
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      {!isMobile && <SuperAdminDesktopSidebar />}
      
      {/* Mobile handling would go here if needed */}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pt-0' : 'md:ml-64'} bg-gray-100 dark:bg-gray-900 min-h-screen`}>
        <div className={`w-full min-h-screen ${isMobile ? 'px-4 py-6' : 'p-6'}`}>
          {children}
        </div>
      </main>
    </div>
  );
}