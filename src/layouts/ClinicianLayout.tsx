
import { ReactNode } from 'react';
import { MainNav } from '@/components/MainNav';

type ClinicianLayoutProps = {
  children: ReactNode;
};

export default function ClinicianLayout({ children }: ClinicianLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <MainNav />
      
      {/* Main Content */}
      <main className="pt-16 md:pt-0">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
