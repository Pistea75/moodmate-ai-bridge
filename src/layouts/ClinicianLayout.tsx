
import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <MainNav />
      
      {/* Main Content */}
      <main className="flex-1 bg-background">
        <div className="container mx-auto px-4 py-6 min-h-screen">
          <div className="text-foreground">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
