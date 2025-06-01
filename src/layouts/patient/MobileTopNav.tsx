
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
    <div className="fixed top-0 left-0 w-full h-16 border-b bg-background z-30 md:hidden flex items-center justify-between px-4">
      <div className="flex items-center">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-white border-r">
            <PatientSidebarContent patientName={patientFullName} />
          </SheetContent>
        </Sheet>
        <h3 className="text-lg font-medium">MoodMate</h3>
      </div>
    </div>
  );
}
