
import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';
import { PublicNav } from '@/components/PublicNav';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Check if we're on a public page
  const isPublicPage = !user || ['/login', '/signup/patient', '/signup/clinician', '/forgot-password', '/reset-password', '/', '/about', '/features', '/pricing', '/contact', '/privacy', '/terms', '/help', '/faq', '/security'].includes(location.pathname);
  
  return (
    <div className={`min-h-screen flex flex-col ${isMobile ? 'bg-background' : 'bg-background'}`}>
      {/* Navigation */}
      {isPublicPage ? <PublicNav /> : <MainNav />}
      
      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'px-0' : ''}`}>
        {children}
      </main>
    </div>
  );
}
