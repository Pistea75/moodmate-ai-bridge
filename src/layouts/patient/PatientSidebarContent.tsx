
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PatientNavItems } from './PatientNavItems';
import { LogoutButton } from '@/components/LogoutButton';
import { Separator } from '@/components/ui/separator';

type PatientSidebarContentProps = {
  patientName: React.ReactNode;
};

export function PatientSidebarContent({ patientName }: PatientSidebarContentProps) {
  const location = useLocation();
  const navItems = PatientNavItems();

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b bg-white">
        <Link to="/patient/dashboard" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-sm">M</span>
          </div>
          <span className="text-lg font-semibold text-primary">MoodMate</span>
        </Link>
        {patientName && (
          <p className="text-sm text-muted-foreground mt-2">Welcome, {patientName}</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 bg-white">
        <div className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <LogoutButton variant="ghost" className="w-full justify-start text-sm" />
      </div>
    </div>
  );
}
