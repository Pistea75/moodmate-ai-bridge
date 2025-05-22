
import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PatientSidebarContent } from './PatientSidebarContent';

type MobileTopNavProps = {
  patientFullName: string;
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
};

export function MobileTopNav({ patientFullName, isOpen, setIsOpen }: MobileTopNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 border-b bg-background z-30 md:hidden">
      <div className="container h-full flex items-center justify-between px-4">
        {/* Mobile Menu Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center justify-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <PatientSidebarContent 
              patientFullName={patientFullName} 
              setIsOpen={setIsOpen} 
              isMobile={true}
            />
          </SheetContent>
        </Sheet>
        
        {/* Centered Logo */}
        <Link to="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground">M</span>
          </div>
          <span className="text-lg font-semibold text-primary">MoodMate</span>
        </Link>
        
        {/* Empty div to maintain flex spacing */}
        <div className="w-8"></div>
      </div>
    </header>
  );
}
