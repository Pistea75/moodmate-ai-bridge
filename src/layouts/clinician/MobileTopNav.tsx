
import React from 'react';
import { MenuIcon, Bell, Search, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ClinicianSidebarContent } from './ClinicianSidebarContent';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';

type MobileTopNavProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function MobileTopNav({ isOpen, setIsOpen }: MobileTopNavProps) {
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
              className="p-0 w-80 bg-white border-r border-gray-200"
            >
              <ClinicianSidebarContent />
            </SheetContent>
          </Sheet>
          
          <Link to="/clinician/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-primary">MoodMate</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 hover:bg-muted/80 active:bg-muted transition-colors"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-9 w-9 hover:bg-muted/80 active:bg-muted transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
