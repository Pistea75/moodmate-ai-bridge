
import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Navigation */}
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1 pt-16 md:pt-0 bg-background">
        <div className="container mx-auto px-4 py-6 bg-background min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
