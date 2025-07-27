
import { ReactNode } from 'react';
import MainLayout from '@/layouts/MainLayout';
import { useIsMobile } from '@/hooks/use-mobile';

interface AuthFormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthFormLayout({ children, title, subtitle }: AuthFormLayoutProps) {
  const isMobile = useIsMobile();
  
  return (
    <MainLayout>
      <div className={`min-h-[calc(100vh-88px)] flex items-center justify-center ${isMobile ? 'px-4 py-6' : 'px-4 py-8'}`}>
        <div className={`w-full ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          <div className={`text-center ${isMobile ? 'mb-6' : 'mb-8'}`}>
            <h1 className={`font-bold ${isMobile ? 'text-2xl' : 'text-3xl'}`}>{title}</h1>
            <p className={`text-muted-foreground ${isMobile ? 'mt-2 text-sm' : 'mt-3'}`}>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
