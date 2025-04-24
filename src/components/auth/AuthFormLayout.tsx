
import { ReactNode } from 'react';
import MainLayout from '@/layouts/MainLayout';

interface AuthFormLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthFormLayout({ children, title, subtitle }: AuthFormLayoutProps) {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </MainLayout>
  );
}
