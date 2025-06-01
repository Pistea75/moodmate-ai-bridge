
import React from 'react';
import { MenuIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PatientSidebarContent } from './PatientSidebarContent';

type MobileTopNavProps = {
  patientFullName: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function MobileTopNav({ patientFullName, isOpen, setIsOpen }: MobileTopNavProps) {
  return (
    <div className="fixed top-0 left-0 w-full h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/95 z-50 md:hidden flex items-center justify-between px-4">
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-background border-r">
            <PatientSidebarContent patientName={patientFullName} />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
            <span className="font-bold text-primary-foreground text-sm">M</span>
          </div>
          <span className="text-lg font-semibold text-primary">MoodMate</span>
        </div>
      </div>
    </div>
  );
}
