
import React from 'react';
import { MenuIcon, MessageCircle, Plus, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { PatientSidebarContent } from './PatientSidebarContent';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type MobileTopNavProps = {
  patientFullName: React.ReactNode;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function MobileTopNav({ patientFullName, isOpen, setIsOpen }: MobileTopNavProps) {
  const { t } = useTranslation();
  
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-50 md:hidden">
      <div className="flex items-center justify-between px-4 h-full">
        <div className="flex items-center gap-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 hover:bg-muted/80 active:bg-muted transition-colors"
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent 
              side="left" 
              className="p-0 w-80 bg-background border-r border-border"
            >
              <PatientSidebarContent patientFullName={patientFullName} />
            </SheetContent>
          </Sheet>
          
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary">MoodMate</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
